-- Create helper functions for device token management
CREATE OR REPLACE FUNCTION public.save_device_token(
  p_token TEXT,
  p_platform TEXT,
  p_user_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Insert or update device token
  INSERT INTO public.device_tokens (token, platform, user_id, is_active)
  VALUES (p_token, p_platform, p_user_id, true)
  ON CONFLICT (token, user_id) 
  DO UPDATE SET 
    is_active = true,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to enable push notifications
CREATE OR REPLACE FUNCTION public.enable_push_notifications(
  p_user_id UUID
) RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET push_enabled = true,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to disable push notifications
CREATE OR REPLACE FUNCTION public.disable_push_notifications(
  p_user_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Disable in profile
  UPDATE public.profiles 
  SET push_enabled = false,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Deactivate device tokens
  UPDATE public.device_tokens
  SET is_active = false,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get push registration status
CREATE OR REPLACE FUNCTION public.get_push_registration_status(
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  is_enabled BOOLEAN;
BEGIN
  SELECT push_enabled INTO is_enabled
  FROM public.profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(is_enabled, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;