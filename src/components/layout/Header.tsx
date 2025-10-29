import React from 'react';
import { Atom } from 'lucide-react';
import { Navigation } from './Navigation';
import { UserProfile } from './UserProfile';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Atom className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          {/* Navigation */}
          <Navigation />

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};