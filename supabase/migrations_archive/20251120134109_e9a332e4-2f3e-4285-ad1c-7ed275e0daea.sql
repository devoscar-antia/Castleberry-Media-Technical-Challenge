-- Add user_id column to sources table to track which user added pending sources
ALTER TABLE public.sources 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_sources_user_id_type ON public.sources(user_id, type);

-- Update existing pending_analysis sources to have a user_id (set to null for now, will need manual assignment if needed)
COMMENT ON COLUMN public.sources.user_id IS 'The user who added this source (for pending_analysis and self_trusted types)';