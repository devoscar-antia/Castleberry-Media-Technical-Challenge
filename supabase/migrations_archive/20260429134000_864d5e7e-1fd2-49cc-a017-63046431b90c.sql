CREATE OR REPLACE FUNCTION public.get_leaderboard(top_n integer DEFAULT 50)
 RETURNS TABLE(profile_id uuid, display_name text, avatar_url text, points integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT p.id AS profile_id,
         p.display_name,
         p.avatar_url,
         pmp.points
  FROM public.profile_monthly_points pmp
  JOIN public.profiles p ON pmp.profile_id = p.id
  WHERE pmp.period_start = date_trunc('month', CURRENT_DATE)
    AND p.id NOT IN (
      'e011b58c-e946-4a27-9904-7fcc25bb7db2', -- David Romero
      'd33d9f26-8dd0-4849-b30b-754d851753f8', -- David Rom3
      'bde0ffb1-ea57-4ddb-a294-44c169685524'  -- Isaac Castejon
    )
  ORDER BY pmp.points DESC, p.display_name ASC
  LIMIT top_n;
$function$;