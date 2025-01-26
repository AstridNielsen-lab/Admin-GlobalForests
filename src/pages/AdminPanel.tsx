import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, Users, FileText } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <ClipboardList className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold">Task Management</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage team tasks and assignments</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">
            View Tasks
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage team members and roles</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">
            View Team
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold">Blog Management</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage blog posts and content</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">
            Manage Blog
          </button>
        </div>
      </div>
    </div>
  );
}