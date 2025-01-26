import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eiabolkprwbxnyfepxpr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpYWJvbGtwcndieG55ZmVweHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NTEwODksImV4cCI6MjA1MzQyNzA4OX0.IH64tEw0s1odLZbuq8aBTl_UK1-NRHPkKDCbT5DhUcY';

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Invalid Supabase URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anonymous key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);