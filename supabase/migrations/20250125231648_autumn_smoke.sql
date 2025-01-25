/*
  # Add Initial Admin User
  
  1. Changes
    - Insert initial admin user
    
  2. Security
    - Creates a secure admin account
    - Uses secure password hashing through Supabase Auth
*/

-- Insert admin user into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'GlobalForests',
  crypt('globalforests2025', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- Get the user id from auth.users
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'GlobalForests';
  
  -- Insert into public.users
  INSERT INTO public.users (id, full_name, role)
  VALUES (v_user_id, 'Admin User', 'admin')
  ON CONFLICT (id) DO NOTHING;
END $$;