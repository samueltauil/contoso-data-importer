import type { ImportRecord, ImportDetails } from '../types/import';
import type { UploadFileResponse, GetImportsResponse, GetImportDetailsResponse } from '../types/api';
import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';

class ImportService {
  async uploadFile(file: File): Promise<ImportRecord | null> {
    const formData = new FormData();
    formData.append('file', file);

    // For development, return mock data
    if (import.meta.env.MODE === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockImport: ImportRecord = {
            id: Date.now().toString(),
            name: file.name,
            status: Math.random() > 0.3 ? 'saved' : 'failed',
            uploadedAt: new Date(),
            fileSize: file.size,
            fileType: file.type,
          };
          resolve(mockImport);
        }, 1500); // Simulate upload delay
      });
    }

    const response = await apiClient.postFormData<UploadFileResponse>(
      API_ENDPOINTS.UPLOAD_FILE,
      formData
    );

    return response.success ? response.data.import : null;
  }

  async getImports(): Promise<ImportRecord[]> {
    // For development, return mock data
    if (import.meta.env.MODE === 'development') {
      const mockImports: ImportRecord[] = [
        {
          id: '1',
          name: 'data1.json',
          status: 'saved',
          uploadedAt: new Date('2024-10-27T10:30:00'),
          fileSize: 1024 * 50, // 50KB
          fileType: 'application/json',
        },
        {
          id: '2',
          name: 'data2.json',
          status: 'saved',
          uploadedAt: new Date('2024-10-27T11:15:00'),
          fileSize: 1024 * 75, // 75KB
          fileType: 'application/json',
        },
        {
          id: '3',
          name: 'data3.json',
          status: 'saved',
          uploadedAt: new Date('2024-10-27T12:00:00'),
          fileSize: 1024 * 30, // 30KB
          fileType: 'application/json',
        },
        {
          id: '4',
          name: 'data4.json',
          status: 'failed',
          uploadedAt: new Date('2024-10-27T12:45:00'),
          fileSize: 1024 * 120, // 120KB
          fileType: 'application/json',
        },
      ];
      return Promise.resolve(mockImports);
    }

    const response = await apiClient.get<GetImportsResponse>(API_ENDPOINTS.GET_IMPORTS);
    return response.success ? response.data.imports : [];
  }

  async getImportDetails(id: string): Promise<ImportDetails | null> {
    // For development, return mock data
    if (import.meta.env.MODE === 'development') {
      const mockDetails: ImportDetails = {
        recordsProcessed: 1000,
        recordsSuccessful: 950,
        recordsFailed: 50,
        processingDuration: 2300, // milliseconds
        errorMessages: ['Invalid date format in row 45', 'Missing required field in row 78'],
      };
      return Promise.resolve(mockDetails);
    }

    const endpoint = API_ENDPOINTS.GET_IMPORT_DETAILS.replace(':id', id);
    const response = await apiClient.get<GetImportDetailsResponse>(endpoint);
    return response.success ? response.data.details : null;
  }

  async retryImport(id: string): Promise<ImportRecord | null> {
    // For development, return mock data
    if (import.meta.env.MODE === 'development') {
      const mockImport: ImportRecord = {
        id,
        name: `retry-${id}.json`,
        status: 'processing',
        uploadedAt: new Date(),
        fileSize: 1024 * 80,
        fileType: 'application/json',
      };
      return Promise.resolve(mockImport);
    }

    const endpoint = API_ENDPOINTS.RETRY_IMPORT.replace(':id', id);
    const response = await apiClient.post<UploadFileResponse>(endpoint);
    return response.success ? response.data.import : null;
  }
}

export const importService = new ImportService();