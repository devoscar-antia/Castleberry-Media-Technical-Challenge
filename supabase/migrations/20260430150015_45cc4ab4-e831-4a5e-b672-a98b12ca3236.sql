-- App version control table for soft update prompts
CREATE TABLE public.app_versions (
  platform text PRIMARY KEY CHECK (platform IN ('ios', 'android')),
  min_version text NOT NULL,
  latest_version text NOT NULL,
  update_message text NOT NULL DEFAULT 'A new version is available. Please update for the best experience.',
  store_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;

-- Anyone can read the policy (needed for unauthenticated launch checks)
CREATE POLICY "Public read access to app versions"
  ON public.app_versions FOR SELECT
  USING (true);

-- Only service role can modify
CREATE POLICY "Service role manages app versions"
  ON public.app_versions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Auto-update updated_at
CREATE TRIGGER app_versions_touch_updated_at
  BEFORE UPDATE ON public.app_versions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed: min and latest both at current version 2.0.7 → no prompts shown until you raise these
INSERT INTO public.app_versions (platform, min_version, latest_version, update_message, store_url) VALUES
  ('ios', '2.0.7', '2.0.7', 'A new version of KOL is available with improvements and bug fixes.', 'itms-apps://apps.apple.com/app/id0000000000'),
  ('android', '2.0.7', '2.0.7', 'A new version of KOL is available with improvements and bug fixes.', 'market://details?id=com.newbrain.kol.ses');