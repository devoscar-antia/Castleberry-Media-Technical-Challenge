INSERT INTO public.allowed_emails (email, role, notes)
VALUES ('david.romero@castleberrymedia.co', 'super_admin', 'Demo + admin account (David Rom3)')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';