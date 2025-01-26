import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Loader2, BookOpen } from 'lucide-react';
import { Message, sendMessageToAI, saveMessage, getMessages, generateBlogPost, publishBlogPost } from '../lib/chatService';

export default function Chat() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      const loadedMessages = await getMessages(user.id);
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      role: 'user',
      createdAt: new Date().toISOString(),
      user_id: user.id
    };

    try {
      setMessages(prev => [...prev, userMessage]);
      await saveMessage(userMessage);
      setMessage('');

      // Get AI response
      const aiResponse = await sendMessageToAI(message);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: aiResponse,
        role: 'assistant',
        createdAt: new Date().toISOString(),
        user_id: user.id
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);

      // Show publish option after a meaningful conversation (4+ messages)
      if (messages.length >= 3) {
        const suggestPublishMessage: Message = {
          id: crypto.randomUUID(),
          content: "This conversation seems informative! Would you like to publish it as a blog post? Click the 'Publish to Blog' button above to share these insights with others.",
          role: 'assistant',
          createdAt: new Date().toISOString(),
          user_id: user.id
        };
        setMessages(prev => [...prev, suggestPublishMessage]);
        await saveMessage(suggestPublishMessage);
        setShowPublishConfirm(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToBlog = async () => {
    if (!user || messages.length === 0 || isPublishing) return;

    setIsPublishing(true);
    try {
      // Generate blog post content from the conversation
      const { title, content } = await generateBlogPost(messages);
      
      // Publish the blog post
      await publishBlogPost(title, content, user.id);
      
      // Show success message
      const successMessage: Message = {
        id: crypto.randomUUID(),
        content: "Your conversation has been successfully published as a blog post! You can view it in the blog section.",
        role: 'assistant',
        createdAt: new Date().toISOString(),
        user_id: user.id
      };
      
      setMessages(prev => [...prev, successMessage]);
      await saveMessage(successMessage);
      setShowPublishConfirm(false);
    } catch (error) {
      console.error('Error publishing blog post:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Sorry, there was an error publishing your conversation. Please try again.",
        role: 'assistant',
        createdAt: new Date().toISOString(),
        user_id: user.id
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to access the chat.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md h-[70vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">AI Assistant Chat</h2>
            <p className="text-sm text-gray-600">Ask questions about team management, forest conservation, or get help with administrative tasks.</p>
          </div>
          {showPublishConfirm && (
            <button
              onClick={handlePublishToBlog}
              disabled={isPublishing || messages.length === 0}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
              <span>Publish to Blog</span>
            </button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}