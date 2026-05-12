UPDATE auth.users
SET encrypted_password = crypt('DemoPlay2026!', gen_salt('bf')),
    updated_at = now()
WHERE email = 'david.romero@castleberrymedia.co';