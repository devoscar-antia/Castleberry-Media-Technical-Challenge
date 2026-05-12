
-- 1) Helper: set LinkedIn token for the calling user only
CREATE OR REPLACE FUNCTION public.set_linkedin_token(
  p_token text,
  p_expires_at timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
  SET linkedin_token = p_token,
      linkedin_token_expires_at = p_expires_at,
      updated_at = now()
  WHERE id = v_uid;
END;
$$;

-- 2) Helper: clear LinkedIn token for the calling user only
CREATE OR REPLACE FUNCTION public.clear_linkedin_token()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
  SET linkedin_token = NULL,
      linkedin_token_expires_at = NULL,
      updated_at = now()
  WHERE id = v_uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_linkedin_token(text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_linkedin_token() TO authenticated;

-- 3) Trigger: block direct client writes to sensitive token columns.
--    Service role and SECURITY DEFINER functions (which run as the function owner / postgres) are allowed.
CREATE OR REPLACE FUNCTION public.protect_linkedin_token_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text := current_setting('request.jwt.claim.role', true);
BEGIN
  -- Allow service_role and internal (no JWT) callers like SECURITY DEFINER functions
  IF v_role IS NULL OR v_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Block any change to sensitive columns from authenticated/anon clients
  IF NEW.linkedin_token IS DISTINCT FROM OLD.linkedin_token
     OR NEW.linkedin_token_expires_at IS DISTINCT FROM OLD.linkedin_token_expires_at THEN
    RAISE EXCEPTION 'Direct updates to linkedin_token columns are not allowed. Use set_linkedin_token() / clear_linkedin_token().'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_linkedin_token_columns_trg ON public.profiles;
CREATE TRIGGER protect_linkedin_token_columns_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_linkedin_token_columns();
