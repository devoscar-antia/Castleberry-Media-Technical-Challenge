UPDATE public.sources
SET article_extraction_hints = jsonb_set(
  article_extraction_hints,
  '{image}',
  '[
    {"mode":"image","selector":"meta[property=\"og:image\"]","attr":"content"},
    {"mode":"image","selector":"meta[property=\"og:image:secure_url\"]","attr":"content"},
    {"mode":"image","selector":"meta[name=\"twitter:image\"]","attr":"content"},
    {"mode":"image","selector":"img.single-hero-img"},
    {"mode":"image","selector":".single-hero-media img"},
    {"mode":"image","selector":".single-hero img"},
    {"mode":"image","selector":"article img"},
    {"mode":"image","selector":"main article img"}
  ]'::jsonb,
  true
)
WHERE id = '4b708335-2df0-448e-956c-6417e5e47628';