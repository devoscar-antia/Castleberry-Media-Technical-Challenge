-- 1) Restrict profiles SELECT to owner only.
-- All cross-user reads in the app go through SECURITY DEFINER RPCs
-- (get_public_profiles, get_public_profile, get_leaderboard, get_all_profiles_for_admin)
-- which bypass RLS, and edge functions use the service role.
DROP POLICY IF EXISTS "Public access to safe profile fields only" ON public.profiles;

CREATE POLICY "Users can read their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2) Storage RLS
-- 'articlesimages' bucket is public (read via public URLs, no RLS needed for SELECT
-- since public buckets are readable by anyone by design).
-- 'images' bucket is private. All writes happen via the external scraper using
-- the service role key, which bypasses RLS. We add restrictive policies so that
-- regular authenticated/anon users cannot read/write/delete arbitrary objects.

-- Public read for the public bucket (explicit, in case of future config changes)
DROP POLICY IF EXISTS "Public read for articlesimages" ON storage.objects;
CREATE POLICY "Public read for articlesimages"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'articlesimages');

-- Block all non-service-role writes to articlesimages (service role bypasses anyway)
DROP POLICY IF EXISTS "Block client writes to articlesimages" ON storage.objects;
CREATE POLICY "Block client writes to articlesimages"
ON storage.objects
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

-- Private 'images' bucket — only service role (which bypasses RLS) can access.
-- We intentionally add NO permissive policy for authenticated/anon, which means
-- they have no access. Service role continues to work normally.
-- (No CREATE POLICY needed for "deny" — absence of policy = no access under RLS.)
