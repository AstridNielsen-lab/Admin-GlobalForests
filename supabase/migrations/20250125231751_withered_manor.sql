/*
  # Add Initial Admin User
  
  1. Changes
    - Creates admin user through Supabase auth
    - Links admin user to public users table
    
  2. Security
    - Creates a secure admin account
    - Uses email/password authentication
*/

-- Create the admin user in auth.users if it doesn't exist
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Check if the user already exists
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'admin@globalforests.com';
    
    -- If user doesn't exist, create it
    IF v_user_id IS NULL THEN
        INSERT INTO auth.users (
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
            'admin@globalforests.com',
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
        RETURNING id INTO v_user_id;
    END IF;

    -- Insert or update the user in public.users
    INSERT INTO public.users (id, full_name, role)
    VALUES (v_user_id, 'Admin User', 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        full_name = 'Admin User';
END $$;