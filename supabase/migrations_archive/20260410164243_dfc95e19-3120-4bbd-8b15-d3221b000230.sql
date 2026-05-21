CREATE OR REPLACE FUNCTION public.trigger_extract_sources()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  req_id BIGINT;
BEGIN
  req_id := net.http_post(
    url     := 'http://127.0.0.1:54321/functions/v1/extract-sources',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer '
    ),
    body    := '{"source_type": "all", "global_limit": 5}'::jsonb
  );

  RAISE NOTICE 'Triggered extract-sources, request_id=%', req_id;
  RETURN req_id;
END;
$$;