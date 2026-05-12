
export interface UserPreferences {
  region: string[];
  preferredLanguage: string;
  secondLanguage: string;
  industries: string[];
  keywords: string[]; // Combined array (fixedKeywords + preferredKeywords) for article scoring
  fixedKeywords: string[]; // Auto-assigned by industry selection
  preferredKeywords: string[]; // User-added custom topics
  trustedMedia: string[]; // Names of trusted sources
  trustedSourceIds: string[]; // IDs of self_trusted sources
  matchedTrustedSourceIds?: string[]; // AI-matched fixed trusted source IDs
}
