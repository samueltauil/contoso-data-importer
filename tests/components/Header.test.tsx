import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../src/components/layout/Header';

describe('Header Component', () => {
  it('renders logo', () => {
    render(<Header />);
    
    // Check for the Atom icon (logo) - SVG elements don't have img role
    const atomIcon = document.querySelector('.lucide-atom');
    expect(atomIcon).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Header />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Imports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders user profile', () => {
    render(<Header />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-gray-900');
  });

  it('has correct navigation structure', () => {
    render(<Header />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/');
  });
});