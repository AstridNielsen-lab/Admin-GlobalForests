/*
  # Fix RLS Policies
  
  1. Changes
    - Drop existing policies to prevent conflicts
    - Recreate policies with updated logic to prevent recursion
    
  2. Security
    - Maintains RLS on all tables
    - Simplifies user policies to prevent recursion
    - Ensures proper access control for all operations
*/

-- Drop existing policies
DO $$ 
BEGIN
    -- Drop blog_posts policies if they exist
    DROP POLICY IF EXISTS "Blog posts are publicly readable" ON public.blog_posts;
    DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Users can update their own blog posts" ON public.blog_posts;
    
    -- Drop tasks policies if they exist
    DROP POLICY IF EXISTS "Users can view assigned tasks" ON public.tasks;
    DROP POLICY IF EXISTS "Admin users can manage tasks" ON public.tasks;
    
    -- Drop chat_messages policies if they exist
    DROP POLICY IF EXISTS "Users can view their chat messages" ON public.chat_messages;
    DROP POLICY IF EXISTS "Users can create chat messages" ON public.chat_messages;
    
    -- Drop users policies if they exist
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
    DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.users;
    DROP POLICY IF EXISTS "Public users are viewable" ON public.users;
END $$;

-- Recreate policies
-- Users policies (simplified to prevent recursion)
CREATE POLICY "Public users are viewable"
  ON public.users
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Blog posts policies
CREATE POLICY "Blog posts are publicly readable"
  ON public.blog_posts
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Authenticated users can create blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (author_id = auth.uid());

-- Tasks policies
CREATE POLICY "Users can view assigned tasks"
  ON public.tasks
  FOR SELECT
  USING (assigned_to = auth.uid());

CREATE POLICY "Admin users can manage tasks"
  ON public.tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Chat messages policies
CREATE POLICY "Users can view their chat messages"
  ON public.chat_messages
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create chat messages"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());