
DO $$
DECLARE
  req_id BIGINT;
  service_key TEXT := 'eyJhbGciOiJIUzI1NiIsImtpZCI6Ill5SE9wbENrTUVCa1F2QnYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3lrcHBkcW13YnhlZ2hzdWh0dGNjLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJzZXJ2aWNlX3JvbGUiLCJyb2xlIjoic2VydmljZV9yb2xlIn0.placeholder';
BEGIN
  -- We can't access the service-role key from a migration safely,
  -- so trigger via the existing trigger pattern: pg_net + Authorization built from vault if available.
  -- Instead, this migration is a no-op marker; the actual seed is performed via a follow-up call.
  RAISE NOTICE 'seed-style-from-raw call must be triggered out-of-band';
END $$;
