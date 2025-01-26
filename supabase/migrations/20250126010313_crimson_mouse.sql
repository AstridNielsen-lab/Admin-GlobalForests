/*
  # Add first blog post about global reforestation

  1. Content
    - Add initial blog post about GlobalForests reforestation project
    - Set admin user as author
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user's ID
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  -- Insert the first blog post
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
    admin_id
  );
END $$;