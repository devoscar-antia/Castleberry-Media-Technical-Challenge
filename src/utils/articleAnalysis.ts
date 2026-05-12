
// Article analysis utilities for keyword extraction and scoring
export interface KeywordWeight {
  [keyword: string]: number;
}

export interface UserInteraction {
  articleId: string;
  interactionType: 'viewed' | 'selected' | 'generated_post' | 'skipped' | 'liked' | 'disliked';
  timestamp: string;
  weight: number;
}

export interface ArticleScore {
  articleId: string;
  totalScore: number;
  languageScore: number;
  industryScore: number;
  locationScore: number;
  keywordScore: number;
  recencyScore: number;
  interactionScore: number;
}

// Extract keywords from article title and summary
export const extractKeywords = (title: string, summary?: string): string[] => {
  const text = `${title} ${summary || ''}`.toLowerCase();
  
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'this', 'that', 'these', 'those'
  ]);
  
  // Extract words, filter stop words, and get meaningful keywords
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter(word => /^[a-zA-Z]+$/.test(word)); // Only alphabetic words
  
  // Count frequency and return top keywords
  const frequency: { [key: string]: number } = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 keywords
    .map(([word]) => word);
};

// Calculate language match score
export const calculateLanguageScore = (
  articleLanguage: string,
  preferredLanguage?: string,
  secondLanguage?: string
): number => {
  if (!preferredLanguage || preferredLanguage === "None") return 0.5;
  
  if (articleLanguage === preferredLanguage) return 1.0;
  if (secondLanguage && secondLanguage !== "None" && articleLanguage === secondLanguage) return 0.7;
  
  return 0.1; // Low score for non-matching languages
};

// Calculate industry relevance score
export const calculateIndustryScore = (
  articleIndustries: string[],
  userIndustries: string[]
): number => {
  if (!userIndustries.length || !articleIndustries.length) return 0.5;
  
  const matches = articleIndustries.filter(industry => 
    userIndustries.includes(industry)
  ).length;
  
  const maxPossibleMatches = Math.min(articleIndustries.length, userIndustries.length);
  return maxPossibleMatches > 0 ? matches / maxPossibleMatches : 0.5;
};

// Calculate location relevance score
export const calculateLocationScore = (
  articleLocations: string[],
  userLocations: string[]
): number => {
  if (!userLocations.length || !articleLocations.length) return 0.5;
  
  // Global articles get a baseline score
  if (articleLocations.includes("Global")) return 0.6;
  
  const matches = articleLocations.filter(location => 
    userLocations.includes(location)
  ).length;
  
  const maxPossibleMatches = Math.min(articleLocations.length, userLocations.length);
  return maxPossibleMatches > 0 ? matches / maxPossibleMatches : 0.3;
};

// Calculate keyword relevance score
export const calculateKeywordScore = (
  articleKeywords: string[],
  userKeywordWeights: KeywordWeight
): number => {
  if (!articleKeywords.length || !Object.keys(userKeywordWeights).length) return 0.5;
  
  let totalScore = 0;
  let totalWeight = 0;
  
  articleKeywords.forEach(keyword => {
    const weight = userKeywordWeights[keyword.toLowerCase()] || 0;
    totalScore += weight;
    totalWeight += 1;
  });
  
  return totalWeight > 0 ? Math.min(totalScore / totalWeight, 1.0) : 0.5;
};

// Calculate recency score
export const calculateRecencyScore = (publicationDate?: string): number => {
  if (!publicationDate) return 0.3;
  
  const pubDate = new Date(publicationDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) return 1.0;
  if (daysDiff <= 3) return 0.8;
  if (daysDiff <= 7) return 0.6;
  if (daysDiff <= 14) return 0.4;
  if (daysDiff <= 30) return 0.3;
  
  return 0.1; // Very old articles
};

// Calculate interaction-based score
export const calculateInteractionScore = (
  articleId: string,
  interactionHistory: UserInteraction[]
): number => {
  const relevantInteractions = interactionHistory.filter(
    interaction => interaction.articleId === articleId
  );
  
  if (!relevantInteractions.length) return 0.5; // Neutral for new articles
  
  let score = 0.5;
  relevantInteractions.forEach(interaction => {
    switch (interaction.interactionType) {
      case 'liked':
        score += 0.3 * interaction.weight;
        break;
      case 'generated_post':
        score += 0.2 * interaction.weight;
        break;
      case 'selected':
        score += 0.1 * interaction.weight;
        break;
      case 'viewed':
        score += 0.05 * interaction.weight;
        break;
      case 'skipped':
        score -= 0.1 * interaction.weight;
        break;
      case 'disliked':
        score -= 0.3 * interaction.weight;
        break;
    }
  });
  
  return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
};

// Main scoring function
export const calculateArticleScore = (
  article: {
    id: string;
    keywords?: string[];
    article_language?: string;
    industries?: string[];
    locations?: string[];
    publicationdate?: string;
  },
  userPreferences: {
    preferredLanguage?: string;
    secondLanguage?: string;
    industries?: string[];
    region?: string[];
  },
  userKeywordWeights: KeywordWeight,
  interactionHistory: UserInteraction[]
): ArticleScore => {
  const languageScore = calculateLanguageScore(
    article.article_language || 'English',
    userPreferences.preferredLanguage,
    userPreferences.secondLanguage
  );
  
  const industryScore = calculateIndustryScore(
    article.industries || [],
    userPreferences.industries || []
  );
  
  const locationScore = calculateLocationScore(
    article.locations || [],
    userPreferences.region || []
  );
  
  const keywordScore = calculateKeywordScore(
    article.keywords || [],
    userKeywordWeights
  );
  
  const recencyScore = calculateRecencyScore(article.publicationdate);
  
  const interactionScore = calculateInteractionScore(
    article.id,
    interactionHistory
  );
  
  // Weighted total score
  const totalScore = (
    languageScore * 0.15 +      // Language preference
    industryScore * 0.25 +      // Industry relevance
    locationScore * 0.15 +      // Location relevance
    keywordScore * 0.20 +       // Keyword matching
    recencyScore * 0.15 +       // Recency
    interactionScore * 0.10     // Past interactions
  );
  
  return {
    articleId: article.id,
    totalScore,
    languageScore,
    industryScore,
    locationScore,
    keywordScore,
    recencyScore,
    interactionScore
  };
};

// Update keyword weights based on user interactions
export const updateKeywordWeights = (
  currentWeights: KeywordWeight,
  articleKeywords: string[],
  interactionType: 'positive' | 'negative',
  learningRate: number = 0.1
): KeywordWeight => {
  const updatedWeights = { ...currentWeights };
  
  const adjustment = interactionType === 'positive' ? learningRate : -learningRate;
  
  articleKeywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    const currentWeight = updatedWeights[normalizedKeyword] || 0.5;
    updatedWeights[normalizedKeyword] = Math.max(0, Math.min(1, currentWeight + adjustment));
  });
  
  return updatedWeights;
};
