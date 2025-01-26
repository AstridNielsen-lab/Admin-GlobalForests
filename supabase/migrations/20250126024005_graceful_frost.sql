/*
  # Initial Blog Post Creation

  1. Changes
    - Creates a default admin user
    - Creates initial blog post
    
  2. Security
    - Uses secure UUID generation
    - Maintains referential integrity
*/

-- Create initial blog post with a secure approach
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create a new user directly in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@globalforests.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO new_user_id;

  -- Insert the first blog post using the new user
  INSERT INTO blog_posts (title, content, author_id)
  VALUES (
    'Launching GlobalForests: A Worldwide Reforestation Initiative',
    E'We are thrilled to announce the launch of GlobalForests, an ambitious worldwide reforestation project that aims to combat climate change and restore our planet''s vital forest ecosystems.\n\n
Our mission is to coordinate global efforts to plant and maintain forests across different continents, working with local communities and environmental experts to ensure sustainable, long-term impact.\n\n
Key Project Goals:\n
• Plant 1 million trees across strategic locations by 2025\n
• Establish partnerships with local communities in 20 countries\n
• Implement advanced monitoring systems using satellite technology\n
• Create sustainable employment opportunities in reforestation\n\n
We believe that through collaborative action and innovative management approaches, we can make a significant impact in restoring our planet''s forests. Our team of experts will work closely with local partners to identify optimal planting locations, select appropriate native species, and implement sustainable forest management practices.\n\n
Join us in this crucial mission to restore our planet''s forests and combat climate change. Together, we can create a greener, more sustainable future for generations to come.',
    new_user_id
  );
END $$;