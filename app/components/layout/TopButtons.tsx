import { User } from 'lucide-react';
import React from 'react'

const TopButtons = () => {
    
  const navItems = [
    { id: 'jobs', icon: '✳', color: 'bg-indigo-600' },
    { id: 'categories', icon: '👤', color: 'bg-red-400' },
    { id: 'about', icon: '↓', color: 'bg-green-400' },
    { id: 'blog', icon: '📝', color: 'bg-pink-400' }
  ];
  return (
    <div className="absolute top-0 right-0 p-4 flex items-center space-x-4">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
      <User className="w-6 h-6 text-gray-600" />
    </div>
    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
      S'inscrire
    </button>
  </div>
  )
}

export default TopButtons