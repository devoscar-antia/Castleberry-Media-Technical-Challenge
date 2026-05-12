-- =========================================================
-- 1) PROFILES: tighten UPDATE policy with WITH CHECK + trigger
-- =========================================================

-- Add a trigger that prevents users from escalating their own points
-- or changing immutable fields. Service role bypasses this.
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text := current_setting('request.jwt.claim.role', true);
BEGIN
  -- Allow service_role and internal (no JWT) callers
  IF v_role IS NULL OR v_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- id must never change
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Updating profile id is not allowed.' USING ERRCODE = '42501';
  END IF;

  -- current_month_points may only be modified by service role / triggers
  IF NEW.current_month_points IS DISTINCT FROM OLD.current_month_points THEN
    RAISE EXCEPTION 'Direct updates to current_month_points are not allowed.' USING ERRCODE = '42501';
  END IF;

  -- push_enabled must go through enable/disable_push_notifications RPCs
  IF NEW.push_enabled IS DISTINCT FROM OLD.push_enabled THEN
    RAISE EXCEPTION 'Direct updates to push_enabled are not allowed. Use enable_push_notifications/disable_push_notifications.' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_sensitive_fields_trg ON public.profiles;
CREATE TRIGGER protect_profile_sensitive_fields_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_sensitive_fields();

-- Re-create UPDATE policy with WITH CHECK mirroring USING
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =========================================================
-- 2) Codify existing RLS policies into migrations
-- =========================================================

-- POSTS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
CREATE POLICY "Users can view their own posts"
ON public.posts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
CREATE POLICY "Users can insert their own posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage posts" ON public.posts;
CREATE POLICY "Service role can manage posts"
ON public.posts FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- USER_GOALS
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.user_goals;
CREATE POLICY "Users can view their own goals"
ON public.user_goals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own goals" ON public.user_goals;
CREATE POLICY "Users can insert their own goals"
ON public.user_goals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_goals;
CREATE POLICY "Users can update their own goals"
ON public.user_goals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage user_goals" ON public.user_goals;
CREATE POLICY "Service role can manage user_goals"
ON public.user_goals FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- USER_STREAKS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own streaks" ON public.user_streaks;
CREATE POLICY "Users can view their own streaks"
ON public.user_streaks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.user_streaks;
CREATE POLICY "Users can insert their own streaks"
ON public.user_streaks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own streaks" ON public.user_streaks;
CREATE POLICY "Users can update their own streaks"
ON public.user_streaks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage user_streaks" ON public.user_streaks;
CREATE POLICY "Service role can manage user_streaks"
ON public.user_streaks FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- =========================================================
-- 3) profile_monthly_points: explicit service-role INSERT policy
-- =========================================================
DROP POLICY IF EXISTS "Service role can insert monthly points" ON public.profile_monthly_points;
CREATE POLICY "Service role can insert monthly points"
ON public.profile_monthly_points FOR INSERT
WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage monthly points" ON public.profile_monthly_points;
CREATE POLICY "Service role can manage monthly points"
ON public.profile_monthly_points FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
