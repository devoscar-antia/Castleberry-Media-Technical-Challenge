-- 1. Explicitly deny authenticated/anon access to specialized-extraction (PII protection)
-- Service role policy already exists; this documents the intentional restriction
CREATE POLICY "Deny authenticated read on specialized-extraction"
ON public."specialized-extraction"
FOR SELECT
TO authenticated, anon
USING (false);

CREATE POLICY "Deny authenticated write on specialized-extraction"
ON public."specialized-extraction"
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "Deny authenticated update on specialized-extraction"
ON public."specialized-extraction"
FOR UPDATE
TO authenticated, anon
USING (false);

CREATE POLICY "Deny authenticated delete on specialized-extraction"
ON public."specialized-extraction"
FOR DELETE
TO authenticated, anon
USING (false);

-- 2. Tighten articles INSERT policy: restrict to service_role only
-- App-side article creation already goes through edge functions with service role
-- (process-manual-article, fetch-ses-articles, extract-sources, etc.)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.articles;

CREATE POLICY "Only service role can insert articles"
ON public.articles
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');