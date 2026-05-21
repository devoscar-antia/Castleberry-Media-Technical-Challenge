-- Add push_enabled column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS push_enabled boolean DEFAULT false;

-- Update existing profiles that have device tokens to have push_enabled = true
UPDATE public.profiles p
SET push_enabled = true
WHERE EXISTS (
  SELECT 1 FROM public.device_tokens dt 
  WHERE dt.user_id = p.id AND dt.is_active = true
);

-- Delete all existing device tokens (they are development tokens, won't work with production APNS)
DELETE FROM public.device_tokens;