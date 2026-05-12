-- Explicit service-role-only policy for editorial_configs (RLS already enabled, no policies)
CREATE POLICY "Service role can manage editorial configs"
ON public.editorial_configs
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');