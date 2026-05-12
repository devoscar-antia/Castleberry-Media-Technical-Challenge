-- Add foreign key constraint from sources.user_id to profiles.id with cascade delete
-- First, drop the existing constraint if it exists (sources don't have a FK to profiles yet)
ALTER TABLE sources
DROP CONSTRAINT IF EXISTS sources_user_id_fkey;

-- Add the new foreign key with ON DELETE CASCADE
ALTER TABLE sources
ADD CONSTRAINT sources_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Update the articles foreign key to include ON DELETE CASCADE
-- First drop the existing constraint
ALTER TABLE articles
DROP CONSTRAINT IF EXISTS articles_sourceid_fkey;

-- Re-add it with CASCADE
ALTER TABLE articles
ADD CONSTRAINT articles_sourceid_fkey
FOREIGN KEY (sourceid)
REFERENCES sources(id)
ON DELETE CASCADE;

-- Add index on sources.user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_sources_user_id ON sources(user_id);