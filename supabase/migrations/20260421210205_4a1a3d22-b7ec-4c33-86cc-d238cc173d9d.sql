-- 1) Tighten profile_monthly_points: remove anon/public broad SELECT.
-- Leaderboard uses get_leaderboard() SECURITY DEFINER which bypasses RLS, so UI is unaffected.
DROP POLICY IF EXISTS "allow anon select monthly points" ON public.profile_monthly_points;
DROP POLICY IF EXISTS "enable read access for all users" ON public.profile_monthly_points;

-- Keep the existing "users can view own monthly points" policy (already present).

-- 2) Private 'images' bucket: explicit deny for non-service-role.
-- Service role bypasses RLS, so the external scraper continues to work.
DROP POLICY IF EXISTS "Block client read on images bucket" ON storage.objects;
CREATE POLICY "Block client read on images bucket"
ON storage.objects
FOR SELECT
TO authenticated, anon
USING (bucket_id <> 'images');

DROP POLICY IF EXISTS "Block client write on images bucket" ON storage.objects;
CREATE POLICY "Block client write on images bucket"
ON storage.objects
FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id <> 'images');

DROP POLICY IF EXISTS "Block client update on images bucket" ON storage.objects;
CREATE POLICY "Block client update on images bucket"
ON storage.objects
FOR UPDATE
TO authenticated, anon
USING (bucket_id <> 'images');

DROP POLICY IF EXISTS "Block client delete on images bucket" ON storage.objects;
CREATE POLICY "Block client delete on images bucket"
ON storage.objects
FOR DELETE
TO authenticated, anon
USING (bucket_id <> 'images');

-- 3) Lock search_path on functions missing it (linter fix, no behavior change).
ALTER FUNCTION public.setup_cron_extensions() SET search_path = public;
ALTER FUNCTION public.get_week_start(date) SET search_path = public;
ALTER FUNCTION public.ensure_user_streak(uuid) SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.create_publish_posts_cron_job() SET search_path = public;
ALTER FUNCTION public.trigger_daily_streak_checker() SET search_path = public;
ALTER FUNCTION public.schedule_linkedin_token_maintenance() SET search_path = public;
ALTER FUNCTION public.enable_push_notifications(uuid) SET search_path = public;
ALTER FUNCTION public.disable_push_notifications(uuid) SET search_path = public;
ALTER FUNCTION public.get_push_registration_status(uuid) SET search_path = public;
ALTER FUNCTION public."trigger-fetch-ses-news"() SET search_path = public;
ALTER FUNCTION public.trigger_publish_scheduled_posts() SET search_path = public;
ALTER FUNCTION public.publish_scheduled_posts() SET search_path = public;
ALTER FUNCTION public.trigger_delete_old_articles() SET search_path = public;
ALTER FUNCTION public.ensure_user_goal(uuid) SET search_path = public;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.update_profile_current_month_points() SET search_path = public;
ALTER FUNCTION public.trigger_extract_sources() SET search_path = public;
ALTER FUNCTION public.trigger_specialized_fetch() SET search_path = public;
ALTER FUNCTION public.schedule_publish_posts_cron() SET search_path = public;
ALTER FUNCTION public.trigger_fetch_trusted_articles() SET search_path = public;