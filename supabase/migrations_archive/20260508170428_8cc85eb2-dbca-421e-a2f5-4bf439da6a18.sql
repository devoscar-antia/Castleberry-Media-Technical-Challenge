ALTER TABLE public.user_style_profiles
  ADD COLUMN IF NOT EXISTS edit_examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS confidence text NOT NULL DEFAULT 'none';