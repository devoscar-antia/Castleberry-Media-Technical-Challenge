
-- Restrict 'sources' read access to authenticated users only (was public)
DROP POLICY IF EXISTS "Allow public read access to sources" ON public.sources;
CREATE POLICY "Authenticated users can read sources"
ON public.sources
FOR SELECT
TO authenticated
USING (true);

-- Remove broad public SELECT (listing) on articlesimages bucket.
-- Public bucket URLs remain accessible directly; only client-side listing/search via SDK is removed.
DROP POLICY IF EXISTS "Public read for articlesimages" ON storage.objects;
