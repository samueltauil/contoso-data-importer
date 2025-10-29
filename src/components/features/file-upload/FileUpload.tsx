import React, { useState } from 'react';
import { DropZone } from './DropZone';
import { importService } from '../../../services/importService';
import type { ImportRecord } from '../../../types/import';

interface FileUploadProps {
  onUploadComplete: (importRecord: ImportRecord) => void;
  onUploadError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const importRecord = await importService.uploadFile(file);
      if (importRecord) {
        onUploadComplete(importRecord);
      } else {
        onUploadError('Failed to upload file. Please try again.');
      }
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DropZone onFileSelect={handleFileSelect} disabled={isUploading} />
      
      {isUploading && (
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Uploading file...</span>
          </div>
        </div>
      )}
    </div>
  );
};