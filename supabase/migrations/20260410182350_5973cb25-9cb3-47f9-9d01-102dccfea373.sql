-- Allow service role to delete sources (for preference source removal)
CREATE POLICY "Service role can delete sources"
ON public.sources
FOR DELETE
USING (auth.role() = 'service_role'::text);

-- Allow service role to delete user_articles (cleanup orphaned references)
CREATE POLICY "Service role can delete user_articles"
ON public.user_articles
FOR DELETE
USING (auth.role() = 'service_role'::text);