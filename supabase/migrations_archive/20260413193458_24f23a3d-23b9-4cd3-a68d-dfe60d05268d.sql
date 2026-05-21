
UPDATE public.sources 
SET processed = true, 
    article_url_patterns = '["^https://www\\.ses\\.com/news/blog/.*"]'::jsonb
WHERE id = '15a8d45b-7079-4b1b-8dd7-466387951d04';

UPDATE public.sources 
SET processed = true, 
    article_url_patterns = '["^https://www\\.ses\\.com/news/press-release/.*"]'::jsonb
WHERE id = 'af10323f-594c-4f43-ab43-65fea7d1c2f6';

UPDATE public.sources 
SET processed = true, 
    article_url_patterns = '["^https://www\\.ses\\.com/news/.*"]'::jsonb
WHERE id = '64ccff0f-0c7f-408b-afee-984c9bbddf3e';
