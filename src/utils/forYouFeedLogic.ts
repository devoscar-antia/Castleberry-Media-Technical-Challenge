import { parseISO, isValid, differenceInDays } from "date-fns";

interface Article {
  id: string;
  title: string;
  summary: string;
  imageurl?: string;
  url: string;
  sourceid: string;
  industries?: string[];
  locations?: string[];
  article_language?: string;
  sourceName?: string;
  sourceType?: string;
  publicationdate?: string;
  retrievedat?: string;
  keywords?: string[];
}

interface UserPreferences {
  keywords?: string[];
  industries?: string[];
  preferredLanguage?: string;
  secondLanguage?: string;
  region?: string[];
  trustedMedia?: string[];
}

interface EnhancedArticle extends Article {
  hasKeywordMatch: boolean;
  hasIndustryMatch: boolean;
  effectivePublicationDate?: Date;
  matchType: 'keyword' | 'industry';
}

/**
 * Creates the "For You" feed based on user preferences with specific filtering and sorting logic
 * Includes fallback content strategy when strict filtering returns no results
 */
export const createForYouFeedWithPreferences = (
  articles: Article[],
  preferences: UserPreferences
): Article[] => {
  
  if (!preferences) {
    return [];
  }

  // First, extract recommended articles within 3 days (bypass all filtering)
  const now = new Date();
  const recentRecommendedArticles = articles
    .filter(article => {
      return article.sourceType === 'recommended' && 
             article.retrievedat && 
             differenceInDays(now, parseISO(article.retrievedat)) <= 3;
    })
    .sort((a, b) => {
      // Sort by newest retrievedat first
      const retrievedA = parseISO(a.retrievedat!);
      const retrievedB = parseISO(b.retrievedat!);
      return retrievedB.getTime() - retrievedA.getTime();
    });

  // Remove recent recommended articles from the pool for normal filtering
  const remainingArticles = articles.filter(article => {
    const isRecentRecommended = article.sourceType === 'recommended' && 
                               article.retrievedat && 
                               differenceInDays(now, parseISO(article.retrievedat)) <= 3;
    return !isRecentRecommended;
  });

  // Apply normal filtering to remaining articles
  const strictResults = applyStrictFiltering(remainingArticles, preferences);
  
  let filteredResults: Article[];
  if (strictResults.length > 0) {
    filteredResults = strictResults;
  } else {
    // If no results from strict filtering, apply fallback strategy
    filteredResults = applyFallbackStrategy(remainingArticles, preferences);
  }

  // Combine: recent recommended articles first, then filtered results
  return [...recentRecommendedArticles, ...filteredResults];
};

/**
 * Applies strict filtering with all user preferences
 */
const applyStrictFiltering = (
  articles: Article[],
  preferences: UserPreferences
): Article[] => {
  // Step 1: Filter by language preferences (must be one of the two preferred languages)
  const languageFilteredArticles = articles.filter(article => {
    const articleLanguage = article.article_language;
    const isInPreferredLanguages = articleLanguage === preferences.preferredLanguage || 
                                   articleLanguage === preferences.secondLanguage;
    return isInPreferredLanguages;
  });

  if (languageFilteredArticles.length === 0) {
    return [];
  }

  // Step 2: Filter by region preferences using JSONB path logic like SQL
  const regionFilteredArticles = languageFilteredArticles.filter(article => {
    if (!preferences.region || preferences.region.length === 0) {
      return true; // No region preference, include all
    }
    
    const articleLocations = article.locations || [];
    
    // Check if article has any matching region (including nested JSONB values)
    const hasRegionMatch = articleLocations.some(location => {
      if (typeof location === 'string') {
        return preferences.region!.includes(location) || location === 'Global';
      }
      // Handle nested JSONB values if locations is complex
      return false;
    });
    
    return hasRegionMatch;
  });

  // Step 3: Filter by trusted sources OR keyword matches (keywords bypass trusted media requirement)
  const sourceFilteredArticles = regionFilteredArticles.filter(article => {
    // Check for keyword match first - if found, include regardless of source
    const userKeywords = preferences.keywords || [];
    const hasKeywordMatch = (article.keywords || []).some(articleKeyword => 
      userKeywords.includes(articleKeyword)
    );
    
    if (hasKeywordMatch) {
      return true; // Keyword matches bypass trusted media requirements
    }
    
    // For non-keyword matches, apply trusted source filtering
    const isTrustedMedia = preferences.trustedMedia && preferences.trustedMedia.length > 0 
      ? preferences.trustedMedia.includes(article.sourceName || '')
      : false;
    
    const isSpecificSource = article.sourceType === 'specificsource';
    
    return isTrustedMedia || isSpecificSource;
  });
  
  return applyContentMatching(sourceFilteredArticles, preferences);
};

/**
 * Applies fallback strategy with relaxed filtering when strict filtering returns no results
 */
const applyFallbackStrategy = (
  articles: Article[],
  preferences: UserPreferences
): Article[] => {
  // Step 1: Filter by language preferences
  let languageFilteredArticles = articles.filter(article => {
    const articleLanguage = article.article_language;
    const isInPreferredLanguages = articleLanguage === preferences.preferredLanguage || 
                                   articleLanguage === preferences.secondLanguage;
    return isInPreferredLanguages;
  });

  // If no articles in preferred languages, try with all language articles
  if (languageFilteredArticles.length === 0) {
    languageFilteredArticles = articles.filter(article => 
      article.article_language && article.article_language.trim() !== ''
    );
  }

  if (languageFilteredArticles.length === 0) {
    return getArticlesMatchingRegionAndLanguage(articles, preferences);
  }

  // Step 2: Filter by region preferences
  let regionFilteredArticles = languageFilteredArticles.filter(article => {
    if (!preferences.region || preferences.region.length === 0) {
      return true;
    }
    
    const articleLocations = article.locations || [];
    
    const hasRegionMatch = articleLocations.some(location => {
      if (typeof location === 'string') {
        return preferences.region!.includes(location) || location === 'Global';
      }
      return false;
    });
    
    return hasRegionMatch;
  });

  // If no region matches, try global articles or ignore region entirely
  if (regionFilteredArticles.length === 0) {
    regionFilteredArticles = languageFilteredArticles.filter(article => {
      const articleLocations = article.locations || [];
      return articleLocations.some(location => location === 'Global') || articleLocations.length === 0;
    });
    
    if (regionFilteredArticles.length === 0) {
      regionFilteredArticles = languageFilteredArticles;
    }
  }

  // Step 3: Tiered content matching
  const userKeywords = preferences.keywords || [];
  
  // First tier: Articles with keyword matches
  const keywordMatchedArticles = applyContentMatching(
    regionFilteredArticles.filter(article => {
      const hasKeywordMatch = (article.keywords || []).some(articleKeyword => 
        userKeywords.includes(articleKeyword)
      );
      return hasKeywordMatch;
    }), 
    preferences, 
    true
  );
  
  // Second tier: Articles with industry or trusted media matches (but no keyword matches)
  const industryTrustedArticles = applyContentMatching(
    regionFilteredArticles.filter(article => {
      const hasKeywordMatch = (article.keywords || []).some(articleKeyword => 
        userKeywords.includes(articleKeyword)
      );
      
      if (hasKeywordMatch) return false; // Skip articles already in first tier
      
      // Check industry match
      const normalize = (s: string) =>
        s.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[-_]/g, " ");
      
      const normUserIndustries = (preferences.industries || []).map(normalize);
      const normArticleIndustries = (article.industries || []).map(normalize);
      const hasIndustryMatch = normArticleIndustries.some(ai =>
        normUserIndustries.includes(ai)
      );
      
      // Check trusted media match
      const isTrustedMedia = preferences.trustedMedia && preferences.trustedMedia.length > 0 
        ? preferences.trustedMedia.includes(article.sourceName || '')
        : false;
      
      return hasIndustryMatch || isTrustedMedia;
    }), 
    preferences, 
    true
  );
  
  // Combine first and second tier results
  const combinedResults = [...keywordMatchedArticles, ...industryTrustedArticles];
  
  // If we have more than 10 articles, return them
  if (combinedResults.length > 10) {
    return combinedResults;
  }
  
  // Third tier: If 10 or fewer articles, apply current fallback method
  const fallbackArticles = getArticlesMatchingRegionAndLanguage(articles, preferences);
  
  // Remove duplicates and combine
  const resultIds = new Set(combinedResults.map(a => a.id));
  const additionalArticles = fallbackArticles.filter(a => !resultIds.has(a.id));
  
  return [...combinedResults, ...additionalArticles];
};

/**
 * Returns articles that match user's region and language preferences only
 * Prioritizes articles with industry/keyword/trusted media matches
 */
const getArticlesMatchingRegionAndLanguage = (
  articles: Article[],
  preferences: UserPreferences
): Article[] => {
  const userRegions = preferences.region || [];
  const userLanguages = [preferences.preferredLanguage, preferences.secondLanguage].filter(Boolean);
  const userKeywords = preferences.keywords || [];
  const userIndustries = preferences.industries || [];
  const trustedMedia = preferences.trustedMedia || [];
  
  const normalize = (s: string) =>
    s.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[-_]/g, " ");
  
  const normUserIndustries = userIndustries.map(normalize);
  
  const matchingArticles = articles.filter(article => {
    // Check language match
    const hasLanguageMatch = userLanguages.includes(article.article_language);
    
    // Check region match
    const articleLocations = article.locations || [];
    const hasRegionMatch = articleLocations.some(location => {
      if (typeof location === 'string') {
        return userRegions.includes(location) || location === 'Global';
      }
      return false;
    });
    
    // Return true if matches BOTH language AND region
    return hasLanguageMatch && (hasRegionMatch || userRegions.length === 0);
  });
  
  // Enhance articles with match information for sorting
  const enhancedArticles = matchingArticles.map(article => {
    // Check keyword match
    const hasKeywordMatch = (article.keywords || []).some(keyword => 
      userKeywords.includes(keyword)
    );
    
    // Check if article has any keywords (for users without keyword preferences)
    const hasAnyKeywords = (article.keywords || []).length > 0;
    
    // Check industry match
    const normArticleIndustries = (article.industries || []).map(normalize);
    const hasIndustryMatch = normArticleIndustries.some(industry =>
      normUserIndustries.includes(industry)
    );
    
    // Check trusted media match
    const isTrustedMedia = trustedMedia.includes(article.sourceName || '');
    
    // If user has no keyword preferences, prioritize articles with any keywords
    const keywordPriority = userKeywords.length > 0 ? hasKeywordMatch : hasAnyKeywords;
    
    const hasAdditionalMatch = hasKeywordMatch || hasIndustryMatch || isTrustedMedia || 
                               (userKeywords.length === 0 && hasAnyKeywords);
    
    return {
      ...article,
      hasAdditionalMatch,
      hasKeywordMatch,
      hasIndustryMatch,
      isTrustedMedia,
      hasAnyKeywords,
      keywordPriority
    };
  });
  
  // Sort: first by additional matches, then by publication date
  return enhancedArticles
    .filter(article => article.publicationdate || article.retrievedat)
    .sort((a, b) => {
      // First priority: articles with additional matches
      if (a.hasAdditionalMatch && !b.hasAdditionalMatch) return -1;
      if (!a.hasAdditionalMatch && b.hasAdditionalMatch) return 1;
      
      // Within same match type, sort by date (newest first)
      const dateA = new Date(a.publicationdate || a.retrievedat || 0);
      const dateB = new Date(b.publicationdate || b.retrievedat || 0);
      return dateB.getTime() - dateA.getTime();
    }); // Show all matching articles without limit
};

/**
 * Applies content matching (keywords/industries) and final processing
 */
const applyContentMatching = (
  articles: Article[],
  preferences: UserPreferences,
  isFallback: boolean = false
): Article[] => {
  // Normalize industries
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize("NFKD")               // decompose accents
      .replace(/[\u0300-\u036f]/g, "") // strip diacritics
      .replace(/[-_]/g, " ");          // unify hyphens/underscores into spaces
  
  const normUserIndustries = (preferences.industries || []).map(normalize);
  const userKeywords = preferences.keywords || [];
  
  const enhancedArticles: EnhancedArticle[] = articles
    .map(article => {
      // For keywords: exact match like SQL query
      const hasKeywordMatch = (article.keywords || []).some(articleKeyword => 
        userKeywords.includes(articleKeyword)
      );
  
      // For industries: normalize and match
      const normArticleIndustries = (article.industries || []).map(normalize);
      const hasIndustryMatch = normArticleIndustries.some(ai =>
        normUserIndustries.includes(ai)
      );

      // Apply matching logic based on source type and fallback mode
      if (article.sourceType === 'specificsource') {
        // Specificsource articles only need keyword match
        if (!hasKeywordMatch) return null;
      } else if (isFallback) {
        // In fallback mode: require either keyword OR industry match (ignore trusted source requirement)
        if (!hasKeywordMatch && !hasIndustryMatch) return null;
      } else {
        // Strict mode: require either keyword or industry match
        if (!hasKeywordMatch && !hasIndustryMatch) return null;
      }

      return {
        ...article,
        hasKeywordMatch,
        hasIndustryMatch,
        matchType: hasKeywordMatch ? "keyword" : "industry",
      };
    })
    .filter((a): a is EnhancedArticle => a !== null);

  // Apply date filtering and sorting
  const articlesWithDates = enhancedArticles
    .map(article => {
      let effectiveDate: Date | null = null;

      // For "Recommended" source type, use retrievedat as publicationdate
      if (article.sourceType === 'recommended') {
        if (article.retrievedat) {
          const retrievedDate = parseISO(article.retrievedat);
          if (isValid(retrievedDate)) {
            effectiveDate = retrievedDate;
          }
        }
      } else {
        // For other source types, use publicationdate first, then fallback to retrievedat
        if (article.publicationdate) {
          const pubDate = parseISO(article.publicationdate);
          if (isValid(pubDate)) {
            effectiveDate = pubDate;
          }
        } else if (article.retrievedat) {
          const retrievedDate = parseISO(article.retrievedat);
          if (isValid(retrievedDate)) {
            effectiveDate = retrievedDate;
          }
        }
      }

      return {
        ...article,
        effectivePublicationDate: effectiveDate
      };
    })
    .filter(article => {
      // Only include articles with valid dates that are not too old
      if (!article.effectivePublicationDate) return false;
      
      const daysSincePublication = differenceInDays(new Date(), article.effectivePublicationDate);
      
      // In fallback mode, extend date range to 60 days
      const maxDays = isFallback ? 60 : 30;
      return daysSincePublication <= maxDays;
    });

  // Sort by recency with keyword match priority and recommended articles priority
  const sortedArticles = articlesWithDates.sort((a, b) => {
    const dateA = a.effectivePublicationDate!;
    const dateB = b.effectivePublicationDate!;
    const now = new Date();
    
    // Check if articles are "recommended" type and retrieved within last 3 days
    const isRecommendedRecentA = a.sourceType === 'recommended' && a.retrievedat && 
      differenceInDays(now, parseISO(a.retrievedat)) <= 3;
    const isRecommendedRecentB = b.sourceType === 'recommended' && b.retrievedat && 
      differenceInDays(now, parseISO(b.retrievedat)) <= 3;
    
    // Prioritize recommended articles within 3 days at the top
    if (isRecommendedRecentA && !isRecommendedRecentB) return -1;
    if (!isRecommendedRecentA && isRecommendedRecentB) return 1;
    
    // If both are recommended and recent, sort by newest first (retrievedat date)
    if (isRecommendedRecentA && isRecommendedRecentB) {
      const retrievedA = parseISO(a.retrievedat!);
      const retrievedB = parseISO(b.retrievedat!);
      return retrievedB.getTime() - retrievedA.getTime();
    }
    
    // For non-recommended or older recommended articles, sort by publication date
    const dateComparison = dateB.getTime() - dateA.getTime();
    
    // If dates are the same (within same day), prioritize keyword matches
    if (Math.abs(dateComparison) < 24 * 60 * 60 * 1000) { // Same day
      if (a.hasKeywordMatch && !b.hasKeywordMatch) return -1;
      if (!a.hasKeywordMatch && b.hasKeywordMatch) return 1;
    }
    
    return dateComparison;
  });

  return sortedArticles;
};