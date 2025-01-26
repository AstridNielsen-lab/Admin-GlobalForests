import { supabase } from './supabase';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

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

At the end of meaningful conversations, ask if the user would like to publish the discussion as a blog post.
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

export async function generateBlogPost(messages: Message[]): Promise<{ title: string; content: string }> {
  try {
    const conversation = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `Based on the following conversation, create a well-structured blog post with a title and content. The blog post should be informative and engaging, capturing the key points of the discussion. Include:

1. A clear, concise title (max 100 characters)
2. Well-structured content with:
   - Introduction summarizing the main topic
   - Key points from the discussion
   - Important insights and takeaways
   - Practical recommendations or next steps
   - Conclusion

Format the response as:
TITLE: [Your generated title]
CONTENT: [Your generated content]

Make sure the content is professional, engaging, and valuable for readers interested in forest conservation and environmental management.

Conversation:
${conversation}`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate blog post');
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract title and content
    const titleMatch = generatedText.match(/TITLE:\s*(.*?)\s*\n/);
    const contentMatch = generatedText.match(/CONTENT:\s*([\s\S]*)/);
    
    return {
      title: titleMatch?.[1] || 'Chat Discussion Summary',
      content: contentMatch?.[1].trim() || generatedText
    };
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post');
  }
}

export async function publishBlogPost(title: string, content: string, userId: string) {
  const { error } = await supabase
    .from('blog_posts')
    .insert([
      {
        title,
        content,
        author_id: userId
      }
    ]);
  
  if (error) throw error;
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