CREATE OR REPLACE FUNCTION public.get_leaderboard(top_n integer DEFAULT 50)
 RETURNS TABLE(profile_id uuid, display_name text, avatar_url text, points integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT p.id AS profile_id,
         p.display_name,
         p.avatar_url,
         COALESCE(SUM(pmp.points), 0)::int AS points
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  LEFT JOIN public.profile_monthly_points pmp
    ON pmp.profile_id = p.id
   AND pmp.period_start >= (date_trunc('month', CURRENT_DATE) - INTERVAL '2 months')::date
  WHERE NOT EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE lower(ae.email) = lower(COALESCE(u.email, ''))
      AND ae.role IN ('admin', 'super_admin')
  )
  GROUP BY p.id, p.display_name, p.avatar_url
  HAVING COALESCE(SUM(pmp.points), 0) > 0
  ORDER BY points DESC, p.display_name ASC
  LIMIT top_n;
$function$;