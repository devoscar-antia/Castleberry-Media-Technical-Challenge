CREATE OR REPLACE FUNCTION public.get_posts_for_admin(target_user_id uuid)
RETURNS SETOF public.posts
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE lower(ae.email) = lower(auth.jwt()->>'email')
      AND ae.role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM public.posts
  WHERE user_id = target_user_id
  ORDER BY created_at DESC;
END;
$$;