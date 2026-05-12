SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'update_user_style_profiles_daily';

SELECT cron.schedule(
  'update_user_style_profiles_daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'http://127.0.0.1:54321/functions/v1/update-user-style-profile',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer "}'::jsonb,
    body := '{"stale_only": true}'::jsonb
  ) AS request_id;
  $$
);
