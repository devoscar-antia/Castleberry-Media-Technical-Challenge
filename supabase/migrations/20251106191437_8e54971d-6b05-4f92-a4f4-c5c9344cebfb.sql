-- Create user_articles junction table to track manually added articles per user
CREATE TABLE public.user_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE public.user_articles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own manually added articles
CREATE POLICY "Users can view their own manual articles"
ON public.user_articles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own manual articles
CREATE POLICY "Users can add their own manual articles"
ON public.user_articles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_user_articles_user_id ON public.user_articles(user_id);
CREATE INDEX idx_user_articles_created_at ON public.user_articles(created_at DESC);