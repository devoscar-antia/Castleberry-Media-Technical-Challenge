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
  language?: string;
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

/**
 * Helper function to get effective publication date
 */
export const getEffectivePublicationDate = (article: Article): Date | null => {
  if (article.publicationdate) {
    const pubDate = parseISO(article.publicationdate);
    if (isValid(pubDate)) {
      return pubDate;
    }
  }
  
  // If no publication date, use retrievedat but treat it as 2 days older
  if (article.retrievedat) {
    const retrievedDate = parseISO(article.retrievedat);
    if (isValid(retrievedDate)) {
      const effectiveDate = new Date(retrievedDate);
      effectiveDate.setDate(effectiveDate.getDate() - 2); // Treat as 2 days older
      return effectiveDate;
    }
  }
  
  return null;
};

/**
 * Filter articles by date criteria based on source type
 */
export const filterByDateCriteria = (articles: Article[], sourceType: string): Article[] => {
  const now = new Date();
  
  return articles.filter(article => {
    // For SES Content tab (ses and sesupload), prioritize publication date
    if (sourceType === 'ses' || sourceType === 'sesupload') {
      if (article.publicationdate) {
        // Use publication date if available
        const pubDate = parseISO(article.publicationdate);
        if (isValid(pubDate)) {
          return true; // Accept all articles with publication date
        }
      }
      
      // If no publication date, use retrievedat with 1-day offset
      if (article.retrievedat) {
        const retrievedDate = parseISO(article.retrievedat);
        if (isValid(retrievedDate)) {
          // Add 1 day offset to retrievedat for filtering
          const adjustedDate = new Date(retrievedDate);
          adjustedDate.setDate(adjustedDate.getDate() + 1);
          return differenceInDays(now, adjustedDate) <= 3;
        }
      }
      return false;
    }
    
    // For other types, use existing logic
    const effectiveDate = getEffectivePublicationDate(article);
    if (!effectiveDate) return false;
    
    return true; // Accept all other articles
  });
};

/**
 * Check if article matches user's keywords
 */
export const hasKeywordMatch = (article: Article, preferences: UserPreferences): boolean => {
  if (!preferences.keywords || preferences.keywords.length === 0 || !article.keywords || article.keywords.length === 0) {
    return false;
  }

  return article.keywords.some(articleKeyword => 
    preferences.keywords!.some(userKeyword => 
      userKeyword.toLowerCase() === articleKeyword.toLowerCase() ||
      articleKeyword.toLowerCase().includes(userKeyword.toLowerCase()) ||
      userKeyword.toLowerCase().includes(articleKeyword.toLowerCase())
    )
  );
};

/**
 * Check if article matches user's industries
 */
export const hasIndustryMatch = (article: Article, preferences: UserPreferences): boolean => {
  if (!preferences.industries || preferences.industries.length === 0) {
    return false;
  }

  const articleIndustries = article.industries || [];
  
  return articleIndustries.some(industry => 
    preferences.industries!.some(userIndustry => 
      industry.toLowerCase().includes(userIndustry.toLowerCase()) ||
      userIndustry.toLowerCase().includes(industry.toLowerCase())
    )
  );
};

/**
 * Check if article matches user's language preferences
 */
export const hasLanguageMatch = (article: Article, preferences: UserPreferences): boolean => {
  const articleLanguage = article.language;
  
  return !preferences.preferredLanguage || 
    preferences.preferredLanguage === "None" ||
    articleLanguage === preferences.preferredLanguage || 
    articleLanguage === preferences.secondLanguage ||
    articleLanguage === 'Global';
};

/**
 * Check if article matches user's region preferences
 */
export const hasRegionMatch = (article: Article, preferences: UserPreferences): boolean => {
  const articleLocations = article.locations || [];
  
  return !preferences.region || 
    preferences.region.length === 0 ||
    articleLocations.includes('Global') ||
    articleLocations.some(location => 
      preferences.region!.some(userRegion => 
        location.toLowerCase().includes(userRegion.toLowerCase()) ||
        userRegion.toLowerCase().includes(location.toLowerCase())
      )
    );
};

/**
 * Filter articles for "For You" tab with strict preference matching
 */
export const filterForYouArticles = (articles: Article[], preferences: UserPreferences): Article[] => {
  return articles.filter(article => {
    // SPECIAL CASE: Always include articles with keywords regardless of source type
    // This ensures articles with keywords from any source type are considered
    const hasKeywords = article.keywords && article.keywords.length > 0;
    const keywordMatch = hasKeywords && hasKeywordMatch(article, preferences);

    // Language filter - show only if language matches preferences OR Global is present
    if (!hasLanguageMatch(article, preferences)) {
      return false;
    }

    // If article has matching keywords, apply relaxed filtering
    if (keywordMatch) {
      return true; // Skip other filters for keyword-matching articles
    }

    // Industry filter - show only if industry matches preferences OR Global is present
    const articleIndustries = article.industries || [];
    const industryMatch = !preferences.industries || 
      preferences.industries.length === 0 ||
      articleIndustries.includes('Global') ||
      hasIndustryMatch(article, preferences);
    
    if (!industryMatch) return false;

    // Region filter - show only if region matches preferences OR Global is present
    if (!hasRegionMatch(article, preferences)) {
      return false;
    }

    return true;
  });
};

/**
 * Filter articles by language preferences
 */
export const filterByLanguagePreferences = (articles: Article[], preferences: UserPreferences): Article[] => {
  return articles.filter(article => {
    if (!preferences.preferredLanguage || preferences.preferredLanguage === "None") {
      return true; // No language preference, show all
    }
    
    return article.language === preferences.preferredLanguage || 
           article.language === preferences.secondLanguage;
  });
};