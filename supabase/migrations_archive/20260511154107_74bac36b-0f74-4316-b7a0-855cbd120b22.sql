CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
 RETURNS TABLE(id uuid, display_name text, avatar_url text, email text, preferences jsonb)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE lower(ae.email) = lower(auth.jwt()->>'email')
      AND ae.role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;

  RETURN QUERY
  SELECT p.id,
         p.display_name,
         p.avatar_url,
         COALESCE(u.email, '')::text AS email,
         p.preferences
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id;
END;
$function$;