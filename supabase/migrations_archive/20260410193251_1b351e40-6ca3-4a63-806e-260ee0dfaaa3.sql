
-- Function to get user role by email
CREATE OR REPLACE FUNCTION public.get_user_role(user_email text)
RETURNS public.app_member_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.allowed_emails
  WHERE lower(email) = lower(user_email)
  LIMIT 1;
$$;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_member_role(user_email text, required_role public.app_member_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_emails
    WHERE lower(email) = lower(user_email)
      AND role = required_role
  );
$$;

-- Function to get all profiles for super admin impersonation
CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
RETURNS TABLE(id uuid, display_name text, avatar_url text, email text, preferences jsonb)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is super_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.allowed_emails
    WHERE lower(email) = lower(auth.jwt()->>'email')
      AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;

  RETURN QUERY
  SELECT p.id, p.display_name, p.avatar_url, 
         (auth.jwt()->>'email')::text as email,
         p.preferences
  FROM public.profiles p;
END;
$$;
