-- Set/reset password for the demo reviewer account (David Rom3)
UPDATE auth.users
SET encrypted_password = crypt('DemoPlay2026!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE id = 'abfc4642-05fd-432c-9aba-162e219fb512';