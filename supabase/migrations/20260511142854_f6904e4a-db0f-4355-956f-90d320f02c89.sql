ALTER TABLE public.user_style_profiles
  ADD COLUMN IF NOT EXISTS identity_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS voice_profile     jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS learning_loop     jsonb NOT NULL DEFAULT '{}'::jsonb;