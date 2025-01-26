import React from 'react';
import { Phone, Globe, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Like Look Solutions</h3>
            <p className="text-green-200 mb-4">
              Transforming ideas into innovative solutions.
            </p>
            <a 
              href="https://likelook.wixsite.com/solutions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span>Visit Our Website</span>
            </a>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Developer</h3>
            <p className="text-green-200 mb-2">Julio Campos Machado</p>
            <a 
              href="https://wa.me/5511970603441" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>+55 11 97060-3441</span>
            </a>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-green-200 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/blog" className="text-green-200 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/chat" className="text-green-200 hover:text-white transition-colors">
                  Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-8 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} Like Look Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}