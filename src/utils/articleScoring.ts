import { calculateRecencyMultiplier } from './recencyScoring';
import { hasKeywordMatch, hasIndustryMatch } from './articleFiltering';

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

interface ScoreResult {
  totalScore: number;
  keywordScore: number;
  industryScore: number;
  locationScore: number;
  languageScore: number;
  recencyMultiplier: number;
  details: string;
}

/**
 * Calculate article score using the new multiplicative recency system
 * Base score components are multiplied by the recency multiplier
 */
export const calculateArticleScore = (article: Article, preferences: UserPreferences): ScoreResult => {
  let baseScore = 0;
  let keywordScore = 0;
  let industryScore = 0;
  let locationScore = 0;
  let languageScore = 0;
  let details = "";

  // 1. KEYWORD SCORING - High priority
  if (preferences.keywords && preferences.keywords.length > 0 && article.keywords && article.keywords.length > 0) {
    const keywordMatch = hasKeywordMatch(article, preferences);
    
    if (keywordMatch) {
      // Single keyword articles get premium boost
      if (article.keywords.length === 1) {
        keywordScore = 100;
        details += "Single keyword perfect match (+100); ";
      } else {
        // Multiple keywords - standard scoring
        const keywordMatches = preferences.keywords.filter(keyword => 
          article.keywords!.some(artKeyword => 
            artKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(artKeyword.toLowerCase())
          ) ||
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.summary?.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        keywordScore = (keywordMatches / preferences.keywords.length) * 80;
        details += `Multi-keyword match (${keywordMatches}/${preferences.keywords.length}) (+${keywordScore.toFixed(1)}); `;
      }
    }
  }

  // 2. INDUSTRY SCORING - Medium priority
  if (preferences.industries && preferences.industries.length > 0) {
    const articleIndustries = article.industries || [];
    
    if (hasIndustryMatch(article, preferences)) {
      industryScore = 50;
      details += "Industry match (+50); ";
    } else if (articleIndustries.includes('Global')) {
      industryScore = 30;
      details += "Global industry (+30); ";
    }
  }

  // 3. LOCATION SCORING - Lower priority
  if (preferences.region && preferences.region.length > 0) {
    const articleLocations = article.locations || [];
    
    // Global articles get good score
    if (articleLocations.includes('Global')) {
      locationScore = 25;
      details += "Global location (+25); ";
    } else {
      const locationMatches = articleLocations.filter(location => 
        preferences.region!.some(region => 
          location.toLowerCase().includes(region.toLowerCase()) ||
          region.toLowerCase().includes(location.toLowerCase())
        )
      ).length;
      
      if (locationMatches > 0) {
        locationScore = (locationMatches / preferences.region.length) * 25;
        details += `Location match (${locationMatches}/${preferences.region.length}) (+${locationScore.toFixed(1)}); `;
      }
    }
  }

  // 4. LANGUAGE SCORING - Small boost
  if (article.language === preferences.preferredLanguage) {
    languageScore = 15;
    details += "Preferred language (+15); ";
  } else if (article.language === preferences.secondLanguage) {
    languageScore = 12;
    details += "Second language (+12); ";
  }

  // Calculate base score before applying recency multiplier
  baseScore = keywordScore + industryScore + locationScore + languageScore;

  // 5. RECENCY MULTIPLIER - Applied to base score
  const recencyMultiplier = calculateRecencyMultiplier(article);
  const totalScore = baseScore * recencyMultiplier;
  
  details += `Base score: ${baseScore.toFixed(1)}, Recency multiplier: ${recencyMultiplier.toFixed(2)}×, Final: ${totalScore.toFixed(1)}`;

  return {
    totalScore,
    keywordScore,
    industryScore,
    locationScore,
    languageScore,
    recencyMultiplier,
    details
  };
};

/**
 * Calculate score specifically for "For You" tab with different weightings
 */
export const calculateForYouScore = (article: Article, preferences: UserPreferences): ScoreResult => {
  let baseScore = 0;
  let keywordScore = 0;
  let industryScore = 0;
  let locationScore = 0;
  let languageScore = 0;
  let details = "";

  // 1. KEYWORD SCORING - 100 points for first keyword match
  if (preferences.keywords && preferences.keywords.length > 0 && article.keywords && article.keywords.length > 0) {
    const firstKeyword = article.keywords[0].toLowerCase();
    const hasKeywordMatchValue = preferences.keywords.some(userKeyword => 
      userKeyword.toLowerCase() === firstKeyword ||
      firstKeyword.includes(userKeyword.toLowerCase()) ||
      userKeyword.toLowerCase().includes(firstKeyword)
    );
    
    if (hasKeywordMatchValue) {
      keywordScore = 100;
      details += "First keyword match (+100); ";
    }
  }

  // 2. INDUSTRY SCORING - 50 points for industry match, 45 for global
  if (preferences.industries && preferences.industries.length > 0) {
    const articleIndustries = article.industries || [];
    
    if (hasIndustryMatch(article, preferences)) {
      industryScore = 50;
      details += "Industry match (+50); ";
    } else if (articleIndustries.includes('Global')) {
      industryScore = 45;
      details += "Global industry (+45); ";
    }
  }

  // 3. LOCATION SCORING - 45 points for global region (fallback from industry)
  if (!industryScore && preferences.region && preferences.region.length > 0) {
    const articleLocations = article.locations || [];
    
    if (articleLocations.includes('Global')) {
      locationScore = 45;
      details += "Global region (+45); ";
    }
  }

  // 4. LANGUAGE SCORING - 15 points for preferred, 12 for second language
  if (article.language === preferences.preferredLanguage) {
    languageScore = 15;
    details += "Preferred language (+15); ";
  } else if (article.language === preferences.secondLanguage) {
    languageScore = 12;
    details += "Second language (+12); ";
  }

  // Calculate base score before applying recency multiplier
  baseScore = keywordScore + industryScore + locationScore + languageScore;

  // 5. RECENCY MULTIPLIER - Applied to base score
  const recencyMultiplier = calculateRecencyMultiplier(article);
  const totalScore = baseScore * recencyMultiplier;

  details += `Base score: ${baseScore.toFixed(1)}, Recency multiplier: ${recencyMultiplier.toFixed(2)}×, Final: ${totalScore.toFixed(1)}`;

  return {
    totalScore,
    keywordScore,
    industryScore,
    locationScore,
    languageScore,
    recencyMultiplier,
    details
  };
};