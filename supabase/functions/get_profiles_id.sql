
CREATE OR REPLACE FUNCTION public.get_profiles_id(user_id_input UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id FROM public.profiles WHERE id = user_id_input;
$$;
