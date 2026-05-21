
-- One-off cleanup: delete articles for Digital Ship and Space Intel Report
-- so they can be re-extracted with corrected image URLs
DELETE FROM public.articles
WHERE sourceid IN (
  '64748f45-850f-47ab-b3a0-ae1fc2620583', -- Digital Ship
  '99cb3f2e-b901-46d8-b3c7-fa25e7a4527f'  -- Space Intel Report
);
