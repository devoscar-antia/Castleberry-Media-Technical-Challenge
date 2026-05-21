-- Revoke direct client read of sensitive LinkedIn token column.
-- Column-level privileges in Postgres are checked independently of RLS,
-- so this prevents authenticated/anon roles from selecting the raw token
-- even though they own the row.
REVOKE SELECT (linkedin_token) ON public.profiles FROM authenticated, anon;

-- Provide a safe status RPC for clients: returns only whether a token
-- exists and its expiry, never the secret itself.
CREATE OR REPLACE FUNCTION public.get_my_linkedin_token_status()
RETURNS TABLE (has_token boolean, expires_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (p.linkedin_token IS NOT NULL) AS has_token,
    p.linkedin_token_expires_at      AS expires_at
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_linkedin_token_status() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_my_linkedin_token_status() TO authenticated;