CREATE TABLE public.extraction_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_type TEXT NOT NULL DEFAULT 'all',
  triggered_by TEXT NOT NULL DEFAULT 'cron',
  total_sources INTEGER NOT NULL DEFAULT 0,
  ready_sources INTEGER NOT NULL DEFAULT 0,
  retry_sources INTEGER NOT NULL DEFAULT 0,
  articles_inserted INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT false,
  scrapper_status INTEGER,
  error_message TEXT,
  per_source JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_response JSONB
);

CREATE INDEX idx_extraction_runs_run_at ON public.extraction_runs (run_at DESC);

ALTER TABLE public.extraction_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages extraction runs"
ON public.extraction_runs FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view extraction runs"
ON public.extraction_runs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE lower(ae.email) = lower(auth.jwt()->>'email')
      AND ae.role IN ('admin', 'super_admin')
  )
);