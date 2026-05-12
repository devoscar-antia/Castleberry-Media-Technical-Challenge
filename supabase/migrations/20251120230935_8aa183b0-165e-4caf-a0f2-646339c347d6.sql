-- Update sources table to cascade delete when user is deleted
-- First, drop the existing foreign key constraint if it exists
ALTER TABLE public.sources 
DROP CONSTRAINT IF EXISTS sources_user_id_fkey;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.sources
ADD CONSTRAINT sources_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Update articles table to cascade delete when source is deleted
-- First, drop the existing foreign key constraint if it exists
ALTER TABLE public.articles 
DROP CONSTRAINT IF EXISTS articles_sourceid_fkey;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.articles
ADD CONSTRAINT articles_sourceid_fkey 
FOREIGN KEY (sourceid) 
REFERENCES public.sources(id) 
ON DELETE CASCADE;