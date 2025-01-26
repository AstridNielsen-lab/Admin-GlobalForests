import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, Users, FileText } from 'lucide-react';
import TaskList from '../components/TaskList';
import TeamList from '../components/TeamList';
import BlogPostForm from '../components/BlogPostForm';

type ActiveView = 'tasks' | 'team' | 'blog';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('tasks');
  const [showBlogForm, setShowBlogForm] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to access the admin panel.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'tasks':
        return <TaskList />;
      case 'team':
        return <TeamList />;
      case 'blog':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Blog Management</h2>
              <button
                onClick={() => setShowBlogForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                <FileText className="h-5 w-5" />
                <span>New Post</span>
              </button>
            </div>
            {showBlogForm && (
              <BlogPostForm
                onClose={() => setShowBlogForm(false)}
                onSuccess={() => setShowBlogForm(false)}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setActiveView('tasks')}
          className={`bg-white p-6 rounded-lg shadow-md transition duration-200 ${
            activeView === 'tasks' ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <ClipboardList className={`h-8 w-8 ${
              activeView === 'tasks' ? 'text-green-600' : 'text-gray-400'
            }`} />
            <h2 className="text-xl font-semibold">Task Management</h2>
          </div>
          <p className="text-gray-600">Manage team tasks and assignments</p>
        </button>

        <button
          onClick={() => setActiveView('team')}
          className={`bg-white p-6 rounded-lg shadow-md transition duration-200 ${
            activeView === 'team' ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className={`h-8 w-8 ${
              activeView === 'team' ? 'text-green-600' : 'text-gray-400'
            }`} />
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>
          <p className="text-gray-600">Manage team members and roles</p>
        </button>

        <button
          onClick={() => setActiveView('blog')}
          className={`bg-white p-6 rounded-lg shadow-md transition duration-200 ${
            activeView === 'blog' ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <FileText className={`h-8 w-8 ${
              activeView === 'blog' ? 'text-green-600' : 'text-gray-400'
            }`} />
            <h2 className="text-xl font-semibold">Blog Management</h2>
          </div>
          <p className="text-gray-600">Manage blog posts and content</p>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
}