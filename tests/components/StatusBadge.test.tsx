import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../src/components/features/data-table/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders success status correctly', () => {
    render(<StatusBadge status="saved" />);
    
    const badge = screen.getByText('Saved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-600');
  });

  it('renders error status correctly', () => {
    render(<StatusBadge status="failed" />);
    
    const badge = screen.getByText('Failed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-600');
  });

  it('renders processing status correctly', () => {
    render(<StatusBadge status="processing" />);
    
    const badge = screen.getByText('Processing');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-600');
  });

  it('applies correct base styling', () => {
    render(<StatusBadge status="saved" />);
    
    const badge = screen.getByText('Saved');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'text-xs', 'font-medium');
  });
});