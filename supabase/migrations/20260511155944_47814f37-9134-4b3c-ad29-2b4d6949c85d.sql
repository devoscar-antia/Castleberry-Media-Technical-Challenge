-- Add impersonated_by column to posts
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS impersonated_by uuid;

CREATE INDEX IF NOT EXISTS idx_posts_impersonated_by ON public.posts(impersonated_by);
CREATE INDEX IF NOT EXISTS idx_posts_user_impersonated ON public.posts(user_id, impersonated_by);

-- Restrict normal "view own posts" policy: real owner only sees rows NOT created by an impersonator
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
CREATE POLICY "Users can view their own posts"
ON public.posts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND impersonated_by IS NULL);

-- Same for update/delete: a user cannot mutate posts that an impersonator created on their behalf
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND impersonated_by IS NULL)
WITH CHECK (auth.uid() = user_id AND impersonated_by IS NULL);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND impersonated_by IS NULL);

-- Insert policy stays as-is; impersonation inserts go through service role in edge function.

-- Update admin RPC to only return rows the calling admin produced via impersonation
CREATE OR REPLACE FUNCTION public.get_posts_for_admin(target_user_id uuid)
RETURNS SETOF public.posts
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_id uuid := auth.uid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE lower(ae.email) = lower(auth.jwt()->>'email')
      AND ae.role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM public.posts
  WHERE user_id = target_user_id
    AND impersonated_by = caller_id
  ORDER BY created_at DESC;
END;
$$;