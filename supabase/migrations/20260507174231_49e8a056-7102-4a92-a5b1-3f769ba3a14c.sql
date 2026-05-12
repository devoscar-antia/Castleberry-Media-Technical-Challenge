
DELETE FROM user_articles WHERE article_id IN (
  SELECT a.id FROM articles a 
  WHERE a.sourceid='1da635a5-336b-4c9c-99ae-6ef26334360c' 
  AND a.id NOT IN (SELECT article_id FROM posts WHERE article_id IS NOT NULL)
);
DELETE FROM articles WHERE sourceid='1da635a5-336b-4c9c-99ae-6ef26334360c' 
  AND id NOT IN (SELECT article_id FROM posts WHERE article_id IS NOT NULL);
