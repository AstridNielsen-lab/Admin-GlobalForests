/*
  # Database Schema Updates
  
  1. Changes
    - Updates blog_posts foreign key to reference auth.users
    - Creates chat_messages table for storing conversation history
    - Adds RLS policies and indexes for performance
  
  2. Security
    - Enables RLS on chat_messages
    - Adds policies for user-specific access control
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can create messages" ON chat_messages;

-- Create new policies
CREATE POLICY "Users can read own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);