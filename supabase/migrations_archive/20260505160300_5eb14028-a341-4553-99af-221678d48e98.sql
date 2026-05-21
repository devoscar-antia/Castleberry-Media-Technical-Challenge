UPDATE public.sources
SET article_extraction_hints = jsonb_set(
  article_extraction_hints,
  '{image}',
  '[
    {"mode":"image","selector":".article-hero__image picture img"},
    {"mode":"image","selector":".article-hero__image img"},
    {"mode":"image","selector":"article picture img"},
    {"mode":"image","selector":"article img"},
    {"mode":"image","selector":"meta[property=\"og:image\"]","attr":"content"}
  ]'::jsonb
)
WHERE id = 'd0146302-6c10-4a5c-ad56-5df21efed48c';