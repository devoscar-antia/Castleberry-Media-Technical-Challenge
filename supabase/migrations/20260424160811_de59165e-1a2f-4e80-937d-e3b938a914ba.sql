DELETE FROM public.user_articles WHERE article_id IN (
  SELECT id FROM public.articles WHERE sourceid IN (
    '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f',
    '64748f45-850f-47ab-b3a0-ae1fc2620583'
  )
);
DELETE FROM public.posts WHERE article_id IN (
  SELECT id FROM public.articles WHERE sourceid IN (
    '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f',
    '64748f45-850f-47ab-b3a0-ae1fc2620583'
  )
);
DELETE FROM public.articles WHERE sourceid IN (
  '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f',
  '64748f45-850f-47ab-b3a0-ae1fc2620583'
);
UPDATE public.sources
SET last_inspected_at = NULL, processed = false
WHERE id IN (
  '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f',
  '64748f45-850f-47ab-b3a0-ae1fc2620583'
);