import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trees, BookOpen, MessageSquare, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Trees className="h-8 w-8" />
            <span className="font-bold text-xl">GlobalForests</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/blog" className="flex items-center space-x-1 hover:text-green-200">
              <BookOpen className="h-5 w-5" />
              <span>Blog</span>
            </Link>

            {user ? (
              <>
                <Link to="/chat" className="flex items-center space-x-1 hover:text-green-200">
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat</span>
                </Link>
                <Link to="/admin" className="flex items-center space-x-1 hover:text-green-200">
                  <Settings className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-green-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}