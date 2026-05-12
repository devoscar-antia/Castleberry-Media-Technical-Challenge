CREATE TABLE public.user_style_profiles (
  user_id uuid NOT NULL PRIMARY KEY,
  style_summary text,
  signature_phrases text[] NOT NULL DEFAULT '{}',
  avoid_phrases text[] NOT NULL DEFAULT '{}',
  samples_count integer NOT NULL DEFAULT 0,
  last_post_id uuid,
  last_computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_style_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own style profile"
ON public.user_style_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role manages style profiles"
ON public.user_style_profiles FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_user_style_profiles_updated_at
BEFORE UPDATE ON public.user_style_profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_user_style_profiles_last_computed ON public.user_style_profiles(last_computed_at);
