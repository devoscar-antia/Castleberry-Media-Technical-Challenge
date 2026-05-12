UPDATE public.sources
SET extraction_limit = 10
WHERE type = 'trusted' AND extraction_limit < 10;