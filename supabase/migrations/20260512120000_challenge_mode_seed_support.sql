-- Challenge-mode support objects. This migration keeps the existing table names
-- used by the app and makes the local branch easy to reset with synthetic data.

ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_status_check;
ALTER TABLE public.posts
  ADD CONSTRAINT posts_status_check
  CHECK (status = ANY (ARRAY['revision', 'scheduled', 'published', 'generating', 'failed']));

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Challenge read demo sources" ON public.sources;
CREATE POLICY "Challenge read demo sources"
ON public.sources FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Challenge read demo articles" ON public.articles;
CREATE POLICY "Challenge read demo articles"
ON public.articles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Challenge users read own profile" ON public.profiles;
CREATE POLICY "Challenge users read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Challenge users update own profile" ON public.profiles;
CREATE POLICY "Challenge users update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Challenge users insert own profile" ON public.profiles;
CREATE POLICY "Challenge users insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Challenge users read own saved articles" ON public.user_articles;
CREATE POLICY "Challenge users read own saved articles"
ON public.user_articles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Challenge users save own articles" ON public.user_articles;
CREATE POLICY "Challenge users save own articles"
ON public.user_articles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Challenge users read own posts" ON public.posts;
CREATE POLICY "Challenge users read own posts"
ON public.posts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Challenge users create own posts" ON public.posts;
CREATE POLICY "Challenge users create own posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Challenge users update own posts" ON public.posts;
CREATE POLICY "Challenge users update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
