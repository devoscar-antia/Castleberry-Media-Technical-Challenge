import { parseISO, isValid, differenceInDays } from "date-fns";

interface Article {
  publicationdate?: string;
  retrievedat?: string;
  sourceType?: string;
}

/**
 * Calculate recency multiplier based on the new multiplicative system
 * Special handling for sesuploads and recommended articles
 * 
 * 0 days: 1.00×
 * 1 day: 0.85×
 * 2 days: 0.75×
 * 3–6 days: 0.75 − 0.05·(d−2) → 0.70, 0.65, 0.60, 0.55
 * 7+ days (until 13): (0.55 − 0.20) − 0.05·(d−7) but clamp to 0.30 → day 7: 0.35, day 8+: max(0.30, …)
 * ≥14 days: 0.30× (minimal)
 */
export const calculateRecencyMultiplier = (article: Article): number => {
  const publicationDate = article.publicationdate ? parseISO(article.publicationdate) : null;
  const retrievedDate = article.retrievedat ? parseISO(article.retrievedat) : null;
  
  // Special handling for sesupload and recommended articles
  if (article.sourceType === 'sesupload' || article.sourceType === 'recommended') {
    // If article is ≤ 2 days old with publication date, boost it
    if (publicationDate && isValid(publicationDate)) {
      const daysSincePublication = differenceInDays(new Date(), publicationDate);
      if (daysSincePublication <= 2) {
        // Give extra boost for very recent articles
        return calculateRecencyMultiplierByDays(daysSincePublication) * 1.2;
      } else {
        // For older articles, fall back to retrievedat
        if (retrievedDate && isValid(retrievedDate)) {
          const daysSinceRetrieved = differenceInDays(new Date(), retrievedDate);
          return calculateRecencyMultiplierByDays(daysSinceRetrieved);
        }
      }
    } else if (retrievedDate && isValid(retrievedDate)) {
      // No publication date, use retrievedat
      const daysSinceRetrieved = differenceInDays(new Date(), retrievedDate);
      return calculateRecencyMultiplierByDays(daysSinceRetrieved);
    }
    
    return 0.30; // Minimal multiplier for articles without dates
  }
  
  // Standard logic for other article types
  if (!publicationDate || !isValid(publicationDate)) {
    // Use retrievedat as fallback
    if (!retrievedDate || !isValid(retrievedDate)) {
      return 0.30; // Minimal multiplier for articles without dates
    }
    
    const daysSinceRetrieved = differenceInDays(new Date(), retrievedDate);
    // For retrieved articles, treat them as if they were published 2 days earlier
    return calculateRecencyMultiplierByDays(daysSinceRetrieved + 2);
  }
  
  const daysSincePublication = differenceInDays(new Date(), publicationDate);
  return calculateRecencyMultiplierByDays(daysSincePublication);
};

/**
 * Calculate recency multiplier based on days since publication
 */
const calculateRecencyMultiplierByDays = (days: number): number => {
  // 0 days: 1.00×
  if (days === 0) {
    return 1.00;
  }
  // 1 day: 0.85×
  else if (days === 1) {
    return 0.85;
  }
  // 2 days: 0.75×
  else if (days === 2) {
    return 0.75;
  }
  // 3–6 days: 0.75 − 0.05·(d−2) → 0.70, 0.65, 0.60, 0.55
  else if (days >= 3 && days <= 6) {
    return 0.75 - (0.05 * (days - 2));
  }
  // 7+ days (until 13): (0.55 − 0.20) − 0.05·(d−7) but clamp to 0.30
  else if (days >= 7 && days <= 13) {
    const baseMultiplier = 0.35; // 0.55 - 0.20
    const decayedMultiplier = baseMultiplier - (0.05 * (days - 7));
    return Math.max(0.30, decayedMultiplier);
  }
  // ≥14 days: 0.30× (minimal)
  else {
    return 0.30;
  }
};

/**
 * Legacy recency score for backward compatibility (to be phased out)
 * @deprecated Use calculateRecencyMultiplier instead
 */
export const calculateEnhancedRecencyScore = (article: Article): number => {
  const publicationDate = article.publicationdate ? parseISO(article.publicationdate) : null;
  
  if (!publicationDate || !isValid(publicationDate)) {
    // Use retrievedat as fallback
    const retrievedDate = article.retrievedat ? parseISO(article.retrievedat) : null;
    if (!retrievedDate || !isValid(retrievedDate)) {
      return 1; // Minimal score for articles without dates
    }
    
    const daysSinceRetrieved = differenceInDays(new Date(), retrievedDate);
    return Math.max(1, 100 - (daysSinceRetrieved * 5)); // Basic decay for retrieved articles
  }
  
  const daysSincePublication = differenceInDays(new Date(), publicationDate);
  
  // Same day = 100 points (best)
  if (daysSincePublication === 0) {
    return 100;
  }
  // 1 day ago = 85 points (15% reduction)
  else if (daysSincePublication === 1) {
    return 85;
  }
  // 2 days ago = 75 points (10% more reduction)
  else if (daysSincePublication === 2) {
    return 75;
  }
  // Days 3-6: 5% reduction each day
  else if (daysSincePublication <= 6) {
    return 75 - ((daysSincePublication - 2) * 5);
  }
  // More than a week: 20% reduction from day 6 score (55), then 5% each additional day
  else if (daysSincePublication === 7) {
    return 35; // 20% reduction from 55
  }
  // Beyond week 1: 5% reduction per day until 2 weeks, then minimal
  else if (daysSincePublication <= 14) {
    return Math.max(5, 35 - ((daysSincePublication - 7) * 5));
  }
  // After 2 weeks: almost not appreciable
  else {
    return Math.max(1, 5 - ((daysSincePublication - 14) * 0.5));
  }
};