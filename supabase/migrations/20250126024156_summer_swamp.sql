/*
  # Blog Posts Schema and Security
  
  1. Changes
    - Creates blog_posts table if it doesn't exist
    - Adds indexes for performance optimization
  
  2. Security
    - Enables RLS
    - Updates policies for access control
*/

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update own blog posts" ON blog_posts;

-- Create policies
CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own blog posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at);