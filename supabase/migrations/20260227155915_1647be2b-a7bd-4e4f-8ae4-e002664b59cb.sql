-- Allow service role to delete articles (needed for cleanup function)
CREATE POLICY "Service role can delete articles"
ON public.articles
FOR DELETE
USING (auth.role() = 'service_role'::text);
