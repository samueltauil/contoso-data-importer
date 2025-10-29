import type { ImportRecord, ImportDetails } from './import';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface UploadFileRequest {
  file: File;
}

export interface UploadFileResponse {
  import: ImportRecord;
}

export interface GetImportsResponse {
  imports: ImportRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface GetImportDetailsResponse {
  details: ImportDetails;
}