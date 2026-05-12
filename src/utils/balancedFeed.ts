import { parseISO, isValid, differenceInDays } from "date-fns";
import { filterByDateCriteria, filterByLanguagePreferences } from './articleFiltering';
import { calculateArticleScore } from './articleScoring';

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


// Helper function to get effective date for sorting
const getEffectiveDateForSorting = (article: Article): Date | null => {
  if (article.publicationdate) {
    const pubDate = parseISO(article.publicationdate);
    if (isValid(pubDate)) {
      return pubDate;
    }
  }
  
  if (article.retrievedat) {
    const retrievedDate = parseISO(article.retrievedat);
    if (isValid(retrievedDate)) {
      return retrievedDate;
    }
  }
  
  return null;
};

// Sort SES Content articles by publication date (newest first)
const sortSESContentByDate = (articles: Article[]): Article[] => {
  return articles.sort((a, b) => {
    const dateA = getEffectiveDateForSorting(a);
    const dateB = getEffectiveDateForSorting(b);
    
    // If both have dates, sort by newest first
    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime();
    }
    
    // If only one has a date, prioritize it
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    
    // If neither has a date, maintain original order
    return 0;
  });
};

// Sort SES Upload articles with recent ones first, then by date
const sortSESUploadByRecencyAndDate = (articles: Article[]): Article[] => {
  const now = new Date();
  
  return articles.sort((a, b) => {
    // Get retrievedat date for recency check
    const retrievedAtA = a.retrievedat ? parseISO(a.retrievedat) : null;
    const retrievedAtB = b.retrievedat ? parseISO(b.retrievedat) : null;
    
    // Calculate days since retrieved
    const daysSinceRetrievedA = retrievedAtA && isValid(retrievedAtA) ? differenceInDays(now, retrievedAtA) : Infinity;
    const daysSinceRetrievedB = retrievedAtB && isValid(retrievedAtB) ? differenceInDays(now, retrievedAtB) : Infinity;
    
    // If both are recent (≤2 days / 48 hours since retrieved), keep at top sorted by retrievedat
    if (daysSinceRetrievedA <= 2 && daysSinceRetrievedB <= 2) {
      if (retrievedAtA && retrievedAtB) {
        return retrievedAtB.getTime() - retrievedAtA.getTime();
      }
      return daysSinceRetrievedA - daysSinceRetrievedB;
    }
    
    // If only one is recent, prioritize it
    if (daysSinceRetrievedA <= 2 && daysSinceRetrievedB > 2) return -1;
    if (daysSinceRetrievedA > 2 && daysSinceRetrievedB <= 2) return 1;
    
    // If both are older than 4 days, sort by publication date (newest first)
    const dateA = getEffectiveDateForSorting(a);
    const dateB = getEffectiveDateForSorting(b);
    
    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime();
    }
    
    // If only one has a date, prioritize it
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    
    // If neither has a date, maintain original order
    return 0;
  });
};

// Enhanced SES feed with custom sorting by source type
export const createBalancedSESFeed = (
  articles: Article[], 
  preferences: UserPreferences
): Article[] => {
  const now = new Date();
  
  // For SES Content (ses): No preference filtering, only date filtering
  const sesArticles = filterByDateCriteria(
    articles.filter(article => article.sourceType === 'ses'), 
    'ses'
  );
  
  // For SES Upload: Apply language filtering first, then date filtering
  const languageFilteredUploadArticles = filterByLanguagePreferences(
    articles.filter(article => article.sourceType === 'sesupload'), 
    preferences
  );
  const sesUploadArticles = filterByDateCriteria(
    languageFilteredUploadArticles, 
    'sesupload'
  );
  
  // Separate recent sesupload articles (within 48 hours) from older ones
  const recentSESUpload: Article[] = [];
  const olderSESUpload: Article[] = [];
  
  sesUploadArticles.forEach(article => {
    const retrievedAt = article.retrievedat ? parseISO(article.retrievedat) : null;
    const daysSinceRetrieved = retrievedAt && isValid(retrievedAt) 
      ? differenceInDays(now, retrievedAt) 
      : Infinity;
    
    if (daysSinceRetrieved <= 2) {
      recentSESUpload.push(article);
    } else {
      olderSESUpload.push(article);
    }
  });
  
  // Sort recent sesupload by retrievedat (newest first)
  const sortedRecentSESUpload = recentSESUpload.sort((a, b) => {
    const retrievedAtA = a.retrievedat ? parseISO(a.retrievedat) : null;
    const retrievedAtB = b.retrievedat ? parseISO(b.retrievedat) : null;
    
    if (retrievedAtA && retrievedAtB) {
      return retrievedAtB.getTime() - retrievedAtA.getTime();
    }
    return 0;
  });
  
  // Combine older sesupload with ses articles and sort by publication date
  const olderArticles = [...olderSESUpload, ...sesArticles];
  const sortedOlderArticles = sortSESContentByDate(olderArticles);
  
  // Combine: recent sesupload first, then the rest sorted by publication date.
  // Dedup by id so an article that exists in both groups is rendered once.
  const combined = [...sortedRecentSESUpload, ...sortedOlderArticles];
  const seen = new Set<string>();
  const allArticles = combined.filter((a) => {
    if (!a?.id || seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
  
  console.log(`SES feed created with ${allArticles.length} articles`);
  console.log(`Recent SES Upload (≤48h):`, sortedRecentSESUpload.length);
  console.log(`Older articles sorted by publication date:`, sortedOlderArticles.length);
  
  return allArticles;
};
