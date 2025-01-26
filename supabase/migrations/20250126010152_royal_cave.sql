/*
  # Create chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `content` (text, message content)
      - `role` (text, either 'user' or 'assistant')
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `chat_messages` table
    - Add policies for:
      - Users can read their own messages
      - Users can create messages
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);