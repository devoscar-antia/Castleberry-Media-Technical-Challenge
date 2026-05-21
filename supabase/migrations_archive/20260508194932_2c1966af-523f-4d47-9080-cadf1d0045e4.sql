-- Fix Satellite World URL patterns: require slug after date, exclude bare date archives
UPDATE sources
SET article_url_patterns = '[
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/\\d{2}/\\d{2}/[^/]+/?$"
]'::jsonb,
article_url_exclude_patterns = '[
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/\\d{2}/\\d{2}/?$",
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/\\d{2}/?$",
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/?$",
  "/category/",
  "/tag/",
  "/author/",
  "/page/"
]'::jsonb
WHERE id = '3a058f13-92a6-4026-9cf6-9e8d2b78be12';

-- Remove the 5 bad archive-page articles so re-extraction can pull real ones
DELETE FROM user_articles WHERE article_id IN (
  SELECT id FROM articles WHERE sourceid = '3a058f13-92a6-4026-9cf6-9e8d2b78be12'
);
DELETE FROM articles WHERE sourceid = '3a058f13-92a6-4026-9cf6-9e8d2b78be12';