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
  JOIN auth.users u ON u.id = p.id
  WHERE pmp.period_start = date_trunc('month', CURRENT_DATE)
    AND lower(COALESCE(u.email, '')) NOT IN (
      'davidromero0429@gmail.com',
      'david.romero@castleberrymedia.co',
      'isaac.castejon@gmail.com'
    )
  ORDER BY pmp.points DESC, p.display_name ASC
  LIMIT top_n;
$function$;