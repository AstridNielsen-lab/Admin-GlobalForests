/*
  # Create Blog Posts Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for:
      - Public read access
      - Authenticated users can create posts
      - Authors can update their own posts
*/

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

-- Policies
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