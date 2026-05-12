-- Update existing pending sources to use the user_id from industries array
UPDATE public.sources 
SET user_id = (industries[1])::uuid 
WHERE type = 'pending_analysis' 
AND user_id IS NULL 
AND industries IS NOT NULL 
AND array_length(industries, 1) > 0;