import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PenSquare, Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import BlogPostForm from '../components/BlogPostForm';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
}

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GlobalForests Blog</h1>
        {user && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            <PenSquare className="h-5 w-5" />
            <span>New Post</span>
          </button>
        )}
      </div>

      {showForm && (
        <BlogPostForm
          onClose={() => setShowForm(false)}
          onSuccess={loadBlogPosts}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading blog posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
                <div className="flex items-center space-x-6 text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="prose max-w-none text-gray-600">
                  {formatContent(post.content)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}