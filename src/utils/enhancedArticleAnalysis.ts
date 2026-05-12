
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisResult {
  success: boolean;
  keywords?: string[];
  language?: string;
  error?: string;
}

// Predefined keywords for matching
const PREDEFINED_KEYWORDS = [
  'renewable energy', 'solar power', 'wind energy', 'hydroelectric', 'geothermal',
  'energy storage', 'battery technology', 'grid infrastructure', 'smart grid',
  'carbon capture', 'climate change', 'sustainability', 'green technology',
  'electric vehicles', 'EV charging', 'energy efficiency', 'power generation',
  'transmission lines', 'distribution network', 'energy policy', 'regulations',
  'investment', 'funding', 'market trends', 'energy transition', 'fossil fuels',
  'nuclear energy', 'biomass', 'hydrogen', 'fuel cells', 'clean energy'
];

// Simple language detection based on common words
const detectLanguage = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Common English words
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  // Common German words
  const germanWords = ['der', 'die', 'das', 'und', 'oder', 'aber', 'in', 'auf', 'an', 'zu', 'für', 'von', 'mit'];
  // Common French words
  const frenchWords = ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec'];
  // Common Spanish words
  const spanishWords = ['el', 'la', 'los', 'las', 'y', 'o', 'pero', 'en', 'sobre', 'a', 'para', 'de', 'con'];

  let englishScore = 0;
  let germanScore = 0;
  let frenchScore = 0;
  let spanishScore = 0;

  englishWords.forEach(word => {
    if (lowerText.includes(` ${word} `) || lowerText.startsWith(`${word} `) || lowerText.endsWith(` ${word}`)) {
      englishScore++;
    }
  });

  germanWords.forEach(word => {
    if (lowerText.includes(` ${word} `) || lowerText.startsWith(`${word} `) || lowerText.endsWith(` ${word}`)) {
      germanScore++;
    }
  });

  frenchWords.forEach(word => {
    if (lowerText.includes(` ${word} `) || lowerText.startsWith(`${word} `) || lowerText.endsWith(` ${word}`)) {
      frenchScore++;
    }
  });

  spanishWords.forEach(word => {
    if (lowerText.includes(` ${word} `) || lowerText.startsWith(`${word} `) || lowerText.endsWith(` ${word}`)) {
      spanishScore++;
    }
  });

  const maxScore = Math.max(englishScore, germanScore, frenchScore, spanishScore);
  if (maxScore === 0) return 'English'; // Default to English if no matches

  if (englishScore === maxScore) return 'English';
  if (germanScore === maxScore) return 'German';
  if (frenchScore === maxScore) return 'French';
  if (spanishScore === maxScore) return 'Spanish';

  return 'English'; // Default fallback
};

// Extract keywords from text based on predefined list
const extractKeywords = (title: string, summary: string): string[] => {
  const fullText = `${title} ${summary}`.toLowerCase();
  const foundKeywords: string[] = [];

  PREDEFINED_KEYWORDS.forEach(keyword => {
    if (fullText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  return foundKeywords;
};

// Simplified article analysis function
export const analyzeAndUpdateArticle = async (
  articleId: string,
  title: string,
  summary: string
): Promise<AnalysisResult> => {
  try {
    console.log(`Starting simplified analysis for article: ${title.substring(0, 50)}...`);
    
    // Extract keywords and detect language
    const keywords = extractKeywords(title, summary);
    const language = detectLanguage(`${title} ${summary}`);
    
    // Update article with analysis results
    const { error } = await supabase
      .from('articles')
      .update({
        keywords: keywords.length > 0 ? keywords : undefined,
        article_language: language
      })
      .eq('id', articleId);

    if (error) {
      console.error('Error updating article analysis:', error);
      throw error;
    }

    console.log(`Successfully analyzed article ${articleId} with ${keywords.length} keywords`);
    
    return {
      success: true,
      keywords,
      language
    };
    
  } catch (error) {
    console.error('Error in analyzeAndUpdateArticle:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Batch analyze multiple articles
export const batchAnalyzeArticles = async (
  articles: Array<{ id: string; title: string; summary: string }>,
  batchSize: number = 20
): Promise<{
  successful: number;
  failed: number;
  errors: string[];
}> => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[]
  };

  // Process articles in batches
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(articles.length / batchSize)}`);
    
    const batchPromises = batch.map(article => 
      analyzeAndUpdateArticle(article.id, article.title, article.summary)
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        results.successful++;
      } else {
        results.failed++;
        const error = result.status === 'rejected' 
          ? result.reason 
          : result.value.error;
        results.errors.push(`Article ${batch[index].id}: ${error}`);
      }
    });
  }

  return results;
};

// Get articles that need analysis (no keywords)
export const getArticlesNeedingAnalysis = async (limit: number = 50) => {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, summary')
    .or('keywords.is.null,keywords.eq.{}')
    .limit(limit);

  if (error) {
    console.error('Error fetching articles needing analysis:', error);
    throw error;
  }

  return data || [];
};
