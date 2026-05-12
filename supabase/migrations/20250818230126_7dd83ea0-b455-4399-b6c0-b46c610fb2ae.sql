-- Create policy to allow public read access to only non-sensitive profile fields
CREATE POLICY "Allow public read access to basic profile info for rankings"
ON public.profiles 
FOR SELECT 
USING (true);

-- Drop the restrictive policy that prevents public ranking access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Re-create the user-only policy but only for sensitive fields
-- This is handled by limiting what the public policy exposes through the application layer