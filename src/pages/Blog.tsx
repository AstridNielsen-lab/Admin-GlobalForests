import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PenSquare } from 'lucide-react';

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = React.useState([]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GlobalForests Blog</h1>
        {user && (
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
            <PenSquare className="h-5 w-5" />
            <span>New Post</span>
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Blog posts will be rendered here */}
        </div>
      )}
    </div>
  );
}