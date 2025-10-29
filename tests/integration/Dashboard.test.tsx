import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../../src/components/pages/Dashboard';

// Mock the import service
vi.mock('../../src/services/importService', () => ({
  importService: {
    getImports: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'test.json',
        status: 'saved',
        uploadedAt: new Date('2024-10-27T10:30:00'),
        fileSize: 1024,
        fileType: 'application/json',
      },
    ]),
    uploadFile: vi.fn().mockResolvedValue({
      id: '2',
      name: 'new-file.json',
      status: 'saved',
      uploadedAt: new Date(),
      fileSize: 2048,
      fileType: 'application/json',
    }),
  },
}));

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays import data on mount', async () => {
    render(<Dashboard />);

    // Should show loading initially
    expect(screen.getByText(/loading imports/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('test.json')).toBeInTheDocument();
    });

    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('handles file upload and updates table', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('test.json')).toBeInTheDocument();
    });

    // Upload a new file
    const file = new File(['test content'], 'upload.json', { type: 'application/json' });
    const input = screen.getByRole('button', { name: /choose file/i }).querySelector('input');
    
    if (input) {
      await user.upload(input, file);

      // Should show uploading state
      await waitFor(() => {
        expect(screen.getByText(/uploading file/i)).toBeInTheDocument();
      });

      // Should update table with new file
      await waitFor(() => {
        expect(screen.getByText('new-file.json')).toBeInTheDocument();
      }, { timeout: 3000 });
    }
  });

  it('shows page title correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByRole('heading', { name: /contoso data importer/i })).toBeInTheDocument();
  });

  it('handles view details functionality', async () => {
    const user = userEvent.setup();
    
    // Mock window.alert for testing
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('test.json')).toBeInTheDocument();
    });

    const viewButton = screen.getByRole('button', { name: /view/i });
    await user.click(viewButton);

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('Details for test.json')
    );

    alertSpy.mockRestore();
  });

  it('displays error states appropriately', async () => {
    // Mock service to throw error
    const { importService } = await import('../../src/services/importService');
    vi.mocked(importService.getImports).mockRejectedValueOnce(new Error('API Error'));

    render(<Dashboard />);

    // The error is displayed as "API Error" not "failed to load imports"
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});