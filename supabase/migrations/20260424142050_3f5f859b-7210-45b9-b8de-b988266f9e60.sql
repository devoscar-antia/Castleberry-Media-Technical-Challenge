DELETE FROM public.user_articles WHERE article_id IN (SELECT id FROM public.articles WHERE sourceid = '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f');
DELETE FROM public.posts WHERE article_id IN (SELECT id FROM public.articles WHERE sourceid = '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f');
DELETE FROM public.articles WHERE sourceid = '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f';