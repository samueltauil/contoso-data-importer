import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../../src/components/features/file-upload/FileUpload';

describe('FileUpload Component', () => {
  const mockOnUploadComplete = vi.fn();
  const mockOnUploadError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload area with correct text', () => {
    render(
      <FileUpload
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    expect(screen.getByText(/drag and drop a file here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument();
  });

  it('shows loading state during upload', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const file = new File(['test content'], 'test.json', { type: 'application/json' });
    const input = screen.getByRole('button', { name: /choose file/i }).querySelector('input');
    
    if (input) {
      await user.upload(input, file);
      expect(screen.getByText(/uploading file/i)).toBeInTheDocument();
    }
  });

  it('displays file format restrictions', () => {
    render(
      <FileUpload
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    expect(screen.getByText(/supported formats/i)).toBeInTheDocument();
    expect(screen.getByText(/max 10mb/i)).toBeInTheDocument();
  });

  it('handles file validation errors', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    // Create a file that exceeds size limit
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.json', { 
      type: 'application/json' 
    });
    
    const input = screen.getByRole('button', { name: /choose file/i }).querySelector('input');
    
    if (input) {
      await user.upload(input, largeFile);
      await waitFor(() => {
        expect(screen.getByText(/file is too large/i)).toBeInTheDocument();
      });
    }
  });

  it('accepts valid file types', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const validFile = new File(['{"test": "data"}'], 'test.json', { 
      type: 'application/json' 
    });
    
    const input = screen.getByRole('button', { name: /choose file/i }).querySelector('input');
    
    if (input) {
      await user.upload(input, validFile);
      
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalled();
      }, { timeout: 3000 });
    }
  });
});