-- Run this in your Supabase SQL Editor to disable email confirmation
-- Go to: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe/sql

-- Disable email confirmation requirement
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Update auth configuration to disable email confirmation for new users
-- Note: This might need to be done in the Supabase dashboard under Authentication > Settings
-- Set "Enable email confirmations" to OFF

-- Alternative: Update the auth.config if accessible
-- INSERT INTO auth.config (parameter, value) 
-- VALUES ('MAILER_AUTOCONFIRM', 'true')
-- ON CONFLICT (parameter) DO UPDATE SET value = 'true';

SELECT 'Email confirmation disabled for existing and new users' as status;