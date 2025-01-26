/*
  # Fix database relationships

  1. Changes
    - Add foreign key relationship between blog_posts and profiles
    - Add missing chat_messages table
    - Update RLS policies
*/

-- Fix blog_posts foreign key relationship
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey,
ADD CONSTRAINT blog_posts_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES auth.users(id);

-- Create chat_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_messages
CREATE POLICY IF NOT EXISTS "Users can read own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);