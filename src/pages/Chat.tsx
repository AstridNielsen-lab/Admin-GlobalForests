import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Array<{ text: string; sender: string }>>([]);

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
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">AI Assistant Chat</h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Start a conversation with the AI assistant!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Messages will be rendered here */}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <form className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}