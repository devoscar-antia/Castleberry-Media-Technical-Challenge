// OpenAI-powered article analysis utilities
export interface OpenAIArticleAnalysis {
  categories: string[];
  industries: string[];
  locations: string[];
  keywords: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  relevanceScore: number;
  summary: string;
  emergingTrends: string[];
}

export interface EnhancedArticleScore {
  totalScore: number;
  semanticScore: number;
  industryRelevance: number;
  locationRelevance: number;
  topicMatch: number;
  trendScore: number;
  sentimentScore: number;
  complexityMatch: number;
  reasoning: string;
  languageScore: number;
  industryScore: number;
  locationScore: number;
  keywordScore: number;
  recencyScore: number;
  interactionScore: number;
}

// Analyze article content using OpenAI
export const analyzeArticleWithOpenAI = async (
  title: string,
  summary: string,
  userPreferences: {
    industries?: string[];
    region?: string[];
    keywords?: string[];
    preferredLanguage?: string;
  }
): Promise<OpenAIArticleAnalysis> => {
  const prompt = `Analyze this article and provide a comprehensive categorization:

Title: "${title}"
Summary: "${summary}"

User preferences for context:
- Industries: ${userPreferences.industries?.join(', ') || 'None specified'}
- Regions: ${userPreferences.region?.join(', ') || 'None specified'}
- Keywords: ${userPreferences.keywords?.join(', ') || 'None specified'}

Please analyze and return a JSON object with:
1. categories: Array of main topic categories
2. industries: Array of relevant industries (use standard industry names)
3. locations: Array of geographic regions mentioned or implied
4. keywords: Array of key terms and concepts
5. topics: Array of specific subject matters
6. sentiment: Overall sentiment (positive/neutral/negative)
7. complexity: Content complexity level (beginner/intermediate/advanced)
8. relevanceScore: Overall relevance score (0-1)
9. summary: Brief 1-sentence summary of main point
10. emergingTrends: Array of cutting-edge topics or trends identified

Focus on semantic understanding rather than just keyword matching. Consider context, implications, and industry connections.`;

  // Use fallback analysis since analyze-article function has been removed
  console.log('Using fallback analysis for article:', title);
  return {
    categories: [title.split(' ')[0]],
    industries: [],
    locations: [],
    keywords: title.split(' ').slice(0, 5),
    topics: [title],
    sentiment: 'neutral' as const,
    complexity: 'intermediate' as const,
    relevanceScore: 0.5,
    summary: summary || title,
    emergingTrends: []
  };
};

// Calculate enhanced score based on OpenAI analysis
export const calculateEnhancedScore = (
  analysis: OpenAIArticleAnalysis,
  userPreferences: {
    industries?: string[];
    region?: string[];
    keywords?: string[];
  },
  userInteractions: Array<{
    articleId: string;
    interactionType: string;
    timestamp: string;
  }>
): EnhancedArticleScore => {
  let semanticScore = 0;
  let industryRelevance = 0;
  let locationRelevance = 0;
  let topicMatch = 0;
  let trendScore = 0;
  let sentimentScore = 0;
  let complexityMatch = 0;

  // Semantic matching - more sophisticated than keyword matching
  if (userPreferences.keywords && userPreferences.keywords.length > 0) {
    const keywordMatches = analysis.keywords.filter(keyword =>
      userPreferences.keywords!.some(userKeyword =>
        keyword.toLowerCase().includes(userKeyword.toLowerCase()) ||
        userKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    semanticScore = Math.min(keywordMatches.length / userPreferences.keywords.length, 1.0);
  }

  // Industry relevance - exact and related matches
  if (userPreferences.industries && userPreferences.industries.length > 0) {
    const industryMatches = analysis.industries.filter(industry =>
      userPreferences.industries!.includes(industry)
    );
    industryRelevance = industryMatches.length / userPreferences.industries.length;
  }

  // Location relevance
  if (userPreferences.region && userPreferences.region.length > 0) {
    const locationMatches = analysis.locations.filter(location =>
      userPreferences.region!.includes(location) || location === 'Global'
    );
    locationRelevance = locationMatches.length > 0 ? 0.8 : 0.3;
  }

  // Topic matching using categories and topics
  topicMatch = analysis.relevanceScore;

  // Trend score - bonus for emerging trends
  trendScore = analysis.emergingTrends.length > 0 ? 0.2 : 0;

  // Sentiment score - slight preference for positive content
  sentimentScore = analysis.sentiment === 'positive' ? 0.1 : 
                  analysis.sentiment === 'neutral' ? 0.05 : 0;

  // Complexity match - assume intermediate is preferred
  complexityMatch = analysis.complexity === 'intermediate' ? 0.1 : 0.05;

  const totalScore = (
    semanticScore * 0.3 +
    industryRelevance * 0.25 +
    locationRelevance * 0.15 +
    topicMatch * 0.15 +
    trendScore * 0.1 +
    sentimentScore * 0.03 +
    complexityMatch * 0.02
  );

  const reasoning = `Semantic: ${(semanticScore * 100).toFixed(0)}%, Industry: ${(industryRelevance * 100).toFixed(0)}%, Location: ${(locationRelevance * 100).toFixed(0)}%, Topics: ${(topicMatch * 100).toFixed(0)}%`;

  return {
    totalScore: Math.min(totalScore, 1.0),
    semanticScore,
    industryRelevance,
    locationRelevance,
    topicMatch,
    trendScore,
    sentimentScore,
    complexityMatch,
    reasoning,
    languageScore: semanticScore,
    industryScore: industryRelevance,
    locationScore: locationRelevance,
    keywordScore: semanticScore,
    recencyScore: trendScore,
    interactionScore: 0
  };
};
