UPDATE public.profiles p
SET linkedin_token_expires_at = now() + interval '60 days',
    updated_at = now()
FROM auth.users u
WHERE u.id = p.id
  AND lower(u.email) IN (
    'davidromero0429@gmail.com',
    'david.romero@castleberrymedia.co',
    'isaac.castejon@gmail.com'
  )
  AND p.linkedin_token IS NOT NULL
  AND (
    p.linkedin_token_expires_at IS NULL
    OR p.linkedin_token_expires_at < now() + interval '7 days'
  );