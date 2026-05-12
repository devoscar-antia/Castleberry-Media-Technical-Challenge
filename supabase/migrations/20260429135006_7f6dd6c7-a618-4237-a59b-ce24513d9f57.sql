CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- cron.schedule with the SAME jobname overwrites the existing job (no need to unschedule)
SELECT cron.schedule(
  'daily_extract_sources',
  '0 6 * * *',
  'SELECT public.trigger_extract_sources();'
);

SELECT cron.schedule(
  'Fetch SES Articles',
  '0 */6 * * *',
  'SELECT net.http_post(url:=''http://127.0.0.1:54321/functions/v1/fetch-ses-articles'', headers:=jsonb_build_object(''Content-Type'',''application/json'',''Authorization'',''Bearer ''), body:=''{}''::jsonb) as request_id;'
);

SELECT cron.schedule(
  'Reset Fetch SES Articles',
  '0 0 * * *',
  $sql$UPDATE public.sources SET processed = FALSE WHERE type = 'ses';$sql$
);