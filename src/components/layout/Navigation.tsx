import React from 'react';
import { cn } from '../../utils/formatters';

const navigationItems = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Imports', href: '/imports', current: false },
  { name: 'Settings', href: '/settings', current: false },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="flex space-x-4">
      {navigationItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
            item.current
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
};