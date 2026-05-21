UPDATE sources
SET article_url_exclude_patterns = '[
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/?$",
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/\\d{2}/\\d{2}/?$",
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/\\d{2}/?$",
  "^https?://(?:www\\.)?satelliteworldtoday\\.com/20\\d{2}/?$",
  "/category/",
  "/tag/",
  "/author/",
  "/page/"
]'::jsonb
WHERE id = '3a058f13-92a6-4026-9cf6-9e8d2b78be12';

DELETE FROM user_articles WHERE article_id IN (
  SELECT id FROM articles WHERE sourceid='3a058f13-92a6-4026-9cf6-9e8d2b78be12' AND url='https://satelliteworldtoday.com/'
);
DELETE FROM articles WHERE sourceid='3a058f13-92a6-4026-9cf6-9e8d2b78be12' AND url='https://satelliteworldtoday.com/';