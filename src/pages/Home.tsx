import React from 'react';
import { Trees } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <Trees className="h-24 w-24 text-green-600 mb-8" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to GlobalForests</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Empowering teams to protect and preserve our planet's forests through collaborative action and innovative management.
      </p>
      <img
        src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80"
        alt="Forest landscape"
        className="rounded-lg shadow-xl max-w-4xl w-full object-cover h-96"
      />
    </div>
  );
}