import React from 'react';
import { User } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const user = {
    name: 'John Doe',
    avatar: null, // In a real app, this would be a URL
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-3">
        <span className="text-gray-300 text-sm font-medium">{user.name}</span>
        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
          {user.avatar ? (
            <img
              className="h-8 w-8 rounded-full"
              src={user.avatar}
              alt={user.name}
            />
          ) : (
            <User className="h-5 w-5 text-gray-300" />
          )}
        </div>
      </div>
    </div>
  );
};