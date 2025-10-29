import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importService } from '../../src/services/importService';

// Mock the API client
vi.mock('../../src/services/api', () => ({
  apiClient: {
    postFormData: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('ImportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set development mode for tests
    vi.stubEnv('MODE', 'development');
  });

  describe('uploadFile', () => {
    it('uploads file successfully in development mode', async () => {
      const file = new File(['test content'], 'test.json', { type: 'application/json' });
      
      const result = await importService.uploadFile(file);
      
      expect(result).toBeDefined();
      expect(result?.name).toBe('test.json');
      expect(result?.fileType).toBe('application/json');
      expect(result?.status).toMatch(/^(saved|failed)$/);
    });

    it('handles file upload with correct properties', async () => {
      const file = new File(['{"data": "test"}'], 'data.json', { type: 'application/json' });
      
      const result = await importService.uploadFile(file);
      
      expect(result).toMatchObject({
        name: 'data.json',
        fileType: 'application/json',
        fileSize: file.size,
      });
      expect(result?.id).toBeDefined();
      expect(result?.uploadedAt).toBeInstanceOf(Date);
    });
  });

  describe('getImports', () => {
    it('returns mock import data in development mode', async () => {
      const imports = await importService.getImports();
      
      expect(imports).toHaveLength(4);
      expect(imports[0]).toMatchObject({
        id: '1',
        name: 'data1.json',
        status: 'saved',
      });
      expect(imports[3]).toMatchObject({
        id: '4',
        name: 'data4.json',
        status: 'failed',
      });
    });

    it('returns imports with correct structure', async () => {
      const imports = await importService.getImports();
      
      imports.forEach(importRecord => {
        expect(importRecord).toHaveProperty('id');
        expect(importRecord).toHaveProperty('name');
        expect(importRecord).toHaveProperty('status');
        expect(importRecord).toHaveProperty('uploadedAt');
        expect(importRecord).toHaveProperty('fileSize');
        expect(importRecord).toHaveProperty('fileType');
        expect(importRecord.uploadedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('getImportDetails', () => {
    it('returns mock import details in development mode', async () => {
      const details = await importService.getImportDetails('1');
      
      expect(details).toBeDefined();
      expect(details).toMatchObject({
        recordsProcessed: 1000,
        recordsSuccessful: 950,
        recordsFailed: 50,
        processingDuration: 2300,
      });
      expect(details?.errorMessages).toBeInstanceOf(Array);
    });
  });

  describe('retryImport', () => {
    it('returns updated import record for retry', async () => {
      const result = await importService.retryImport('4');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('4');
      expect(result?.status).toBe('processing');
      expect(result?.name).toContain('retry-4');
    });
  });
});