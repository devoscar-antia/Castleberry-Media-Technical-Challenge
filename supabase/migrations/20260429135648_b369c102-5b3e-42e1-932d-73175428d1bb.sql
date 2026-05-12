-- Remove the duplicate daily_extract_sources we own (jobid 73)
DO $$
DECLARE v_jobid bigint;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job
  WHERE jobname = 'daily_extract_sources' AND username = current_user
  ORDER BY jobid LIMIT 1;
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

-- Create new SES fetch and reset jobs under the migration role with distinct names
SELECT cron.schedule(
  'fetch_ses_articles_v2',
  '0 */6 * * *',
  'SELECT net.http_post(url:=''http://127.0.0.1:54321/functions/v1/fetch-ses-articles'', headers:=jsonb_build_object(''Content-Type'',''application/json'',''Authorization'',''Bearer ''), body:=''{}''::jsonb) as request_id;'
);

SELECT cron.schedule(
  'reset_fetch_ses_articles_v2',
  '0 0 * * *',
  $sql$UPDATE public.sources SET processed = FALSE WHERE type = 'ses';$sql$
);