UPDATE public.sources SET name = CASE apiurl
  WHEN 'https://www.bloombergmedia.com' THEN 'Bloomberg Media'
  WHEN 'https://www.fastcompany.com' THEN 'Fast Company'
  WHEN 'https://www.fiercetechnology.com' THEN 'FierceTechnology'
  WHEN 'https://www.nasaspaceflight.com' THEN 'NASASpaceflight'
  WHEN 'https://www.satellitetoday.com' THEN 'Satellite Today'
  WHEN 'https://techcrunch.com' THEN 'TechCrunch'
  WHEN 'https://www.telecomstechnews.com' THEN 'Telecoms Tech News'
  WHEN 'https://venturebeat.com' THEN 'VentureBeat'
END
WHERE apiurl IN (
  'https://www.bloombergmedia.com','https://www.fastcompany.com','https://www.fiercetechnology.com',
  'https://www.nasaspaceflight.com','https://www.satellitetoday.com','https://techcrunch.com',
  'https://www.telecomstechnews.com','https://venturebeat.com'
);