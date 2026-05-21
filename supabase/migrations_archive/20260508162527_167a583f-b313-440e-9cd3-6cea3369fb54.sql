UPDATE public.sources
SET name = INITCAP(
  -- Strip the TLD (last segment) from the cleaned hostname
  regexp_replace(
    regexp_replace(lower(name), '^https?://(www\.)?', ''),
    '\.[a-z]{2,3}(\.[a-z]{2})?$', ''
  )
)
WHERE name ~* '^https?://';