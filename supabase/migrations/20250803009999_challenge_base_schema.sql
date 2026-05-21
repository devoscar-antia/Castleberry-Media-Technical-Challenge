-- Core tables for local challenge mode (required before incremental migrations).

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  current_month_points integer NOT NULL DEFAULT 0,
  preferences jsonb,
  consents jsonb,
  linkedin_token text,
  linkedin_token_expires_at timestamptz,
  push_enabled boolean DEFAULT false,
  your_thoughts jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  apiurl text NOT NULL,
  type text NOT NULL,
  language text,
  industries text[],
  locations text[],
  article_extraction_hints jsonb DEFAULT '{}'::jsonb,
  article_url_exclude_patterns jsonb,
  article_url_patterns jsonb,
  extraction_limit integer DEFAULT 10,
  last_inspected_at timestamptz,
  lastfetched timestamptz,
  need_filter boolean,
  processed boolean,
  user_id uuid
);

CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  summary text,
  content text,
  imageurl text NOT NULL,
  sourceid uuid REFERENCES public.sources(id),
  publicationdate date,
  retrievedat timestamptz,
  article_language text,
  industries text[],
  keywords text[],
  locations jsonb,
  normalized_url text
);

CREATE TABLE IF NOT EXISTS public.user_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES public.articles(id),
  content text NOT NULL,
  ai_content text,
  status text NOT NULL DEFAULT 'revision',
  scheduled_for timestamptz,
  linkedin_post_url text,
  impersonated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT posts_status_check CHECK (
    status = ANY (ARRAY['revision', 'scheduled', 'published', 'generating', 'failed'])
  )
);
