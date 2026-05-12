select cron.schedule(
  'extract_ses_newsletter_daily',
  '0 5 * * *',
  $$select net.http_post(
    url:='http://127.0.0.1:54321/functions/v1/extract-ses-newsletter',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer "}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;$$
);