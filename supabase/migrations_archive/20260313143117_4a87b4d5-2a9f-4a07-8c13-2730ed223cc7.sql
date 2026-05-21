
-- Create allowed_emails whitelist table
CREATE TABLE public.allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Only service role can manage the whitelist
CREATE POLICY "Service role can manage allowed emails"
  ON public.allowed_emails
  FOR ALL
  TO public
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- Authenticated users can check if their email is whitelisted
CREATE POLICY "Users can check their own email"
  ON public.allowed_emails
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.jwt()->>'email'));

-- Populate with all current users' emails
INSERT INTO public.allowed_emails (email)
SELECT DISTINCT lower(u.email)
FROM auth.users u
WHERE u.email IS NOT NULL
ON CONFLICT (email) DO NOTHING;
