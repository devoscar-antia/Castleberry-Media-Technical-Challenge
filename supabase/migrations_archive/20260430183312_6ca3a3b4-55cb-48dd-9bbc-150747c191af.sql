-- 1. Stop the stuck scheduled post (token expired Sep 2025, looping every minute since Oct 24)
UPDATE public.posts
SET status = 'failed', updated_at = now()
WHERE id = '2d74c929-1e38-4177-85dc-de83ce1acad0'
  AND status = 'scheduled';

-- 2. Drop legacy / duplicate cron jobs by name (cron.unschedule is permitted)
DO $$
DECLARE
  j_name text;
BEGIN
  FOREACH j_name IN ARRAY ARRAY[
    'Fetch articles every 3 days',
    'Fetch SES Articles',
    'Reset Fetch SES Articles',
    'Fetch specialized articles',
    'Reset sources',
    'Reset Specialized Extraction',
    'Delete old articles'
  ] LOOP
    BEGIN
      PERFORM cron.unschedule(j_name);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not unschedule %: %', j_name, SQLERRM;
    END;
  END LOOP;
END $$;

-- 3. Re-schedule the article cleanup cron daily at 02:00 UTC (active by default)
SELECT cron.schedule(
  'delete_old_articles_daily',
  '0 2 * * *',
  $cron$SELECT public.trigger_delete_old_articles();$cron$
);