export interface ImportRecord {
  id: string;
  name: string;
  status: 'saved' | 'failed' | 'processing';
  uploadedAt: Date;
  fileSize: number;
  fileType: string;
  details?: ImportDetails;
}

export interface ImportDetails {
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  processingDuration: number;
  errorMessages?: string[];
}

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}