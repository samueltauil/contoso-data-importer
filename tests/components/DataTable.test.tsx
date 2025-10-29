import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../../src/components/features/data-table/DataTable';
import type { ImportRecord } from '../../src/types/import';

const mockImports: ImportRecord[] = [
  {
    id: '1',
    name: 'data1.json',
    status: 'saved',
    uploadedAt: new Date('2024-10-27T10:30:00'),
    fileSize: 1024 * 50,
    fileType: 'application/json',
  },
  {
    id: '2',
    name: 'data2.json',
    status: 'failed',
    uploadedAt: new Date('2024-10-27T11:15:00'),
    fileSize: 1024 * 75,
    fileType: 'application/json',
  },
];

describe('DataTable Component', () => {
  it('renders table with import records', () => {
    const mockOnViewDetails = vi.fn();
    
    render(<DataTable imports={mockImports} onViewDetails={mockOnViewDetails} />);

    expect(screen.getByText('data1.json')).toBeInTheDocument();
    expect(screen.getByText('data2.json')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('displays empty state when no imports', () => {
    const mockOnViewDetails = vi.fn();
    
    render(<DataTable imports={[]} onViewDetails={mockOnViewDetails} />);

    expect(screen.getByText(/no import records found/i)).toBeInTheDocument();
    expect(screen.getByText(/upload a file to get started/i)).toBeInTheDocument();
  });

  it('renders correct table headers', () => {
    const mockOnViewDetails = vi.fn();
    
    render(<DataTable imports={mockImports} onViewDetails={mockOnViewDetails} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders View buttons for each import', () => {
    const mockOnViewDetails = vi.fn();
    
    render(<DataTable imports={mockImports} onViewDetails={mockOnViewDetails} />);

    const viewButtons = screen.getAllByText('View');
    expect(viewButtons).toHaveLength(2);
  });

  it('calls onViewDetails when View button is clicked', async () => {
    const mockOnViewDetails = vi.fn();
    const user = userEvent.setup();
    
    render(<DataTable imports={mockImports} onViewDetails={mockOnViewDetails} />);

    const firstViewButton = screen.getAllByText('View')[0];
    await user.click(firstViewButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockImports[0]);
  });
});