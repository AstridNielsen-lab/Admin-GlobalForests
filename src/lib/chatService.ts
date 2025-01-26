import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_GEMINI_API_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  user_id?: string;
}

const SYSTEM_PROMPT = `You are an AI assistant for GlobalForests, specializing in team management, forest conservation, and administrative tasks. 
Your responses should be professional, knowledgeable, and focused on helping team members with:
- Forest conservation strategies
- Team management and coordination
- Administrative tasks and workflow optimization
- Environmental impact assessment
- Project planning and execution
Please provide clear, actionable advice while maintaining a supportive and professional tone.`;

export async function sendMessageToAI(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUser: ${message}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get AI response');
  }
}

export async function saveMessage(message: Message) {
  const { error } = await supabase
    .from('chat_messages')
    .insert([message]);
  
  if (error) throw error;
}

export async function getMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}