UPDATE public.sources
SET article_extraction_hints = jsonb_set(
  article_extraction_hints,
  '{image}',
  '[
    {"mode":"image","selector":"meta[property=\"og:image\"]","attr":"content"},
    {"mode":"image","selector":"meta[property=\"og:image:secure_url\"]","attr":"content"},
    {"mode":"image","selector":"meta[name=\"twitter:image\"]","attr":"content"},
    {"mode":"image","selector":".elementor-widget-theme-post-featured-image img"},
    {"mode":"image","selector":"article img"},
    {"mode":"image","selector":"main article picture img"},
    {"mode":"image","selector":"article picture img"},
    {"mode":"image","selector":"main picture img"},
    {"mode":"image","selector":"picture img"},
    {"mode":"image","selector":"main article img"},
    {"mode":"image","selector":"main img"}
  ]'::jsonb
)
WHERE id = '3fe5cbc9-b3a7-49b5-bc54-e7bf84f04021';