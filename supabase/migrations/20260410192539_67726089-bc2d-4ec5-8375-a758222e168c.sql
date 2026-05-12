
-- Create enum for member roles
CREATE TYPE public.app_member_role AS ENUM ('member', 'admin', 'super_admin');

-- Add role column to allowed_emails
ALTER TABLE public.allowed_emails
ADD COLUMN role public.app_member_role NOT NULL DEFAULT 'member';
