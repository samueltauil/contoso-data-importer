import React, { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { FileText, Upload } from 'lucide-react';
import { Button } from '../../ui';
import { cn } from '../../../utils/formatters';

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../../utils/constants';

interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, disabled = false }) => {
  const [dragError, setDragError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setDragError(null);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setDragError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      } else if (error.code === 'file-invalid-type') {
        setDragError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      } else {
        setDragError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    maxSize: MAX_FILE_SIZE,
    disabled,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer',
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          dragError && 'border-red-500 bg-red-50'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            'p-3 rounded-full',
            isDragActive ? 'bg-blue-100' : 'bg-gray-100',
            dragError && 'bg-red-100'
          )}>
            {dragError ? (
              <FileText className="h-8 w-8 text-red-600" />
            ) : (
              <Upload className={cn(
                'h-8 w-8',
                isDragActive ? 'text-blue-600' : 'text-gray-600'
              )} />
            )}
          </div>
          
          <div className="space-y-2">
            {dragError ? (
              <p className="text-red-600 font-medium">{dragError}</p>
            ) : (
              <>
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag and drop a file here, or'}
                </p>
                <Button variant="primary" disabled={disabled}>
                  Choose File
                </Button>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            Supported formats: {ALLOWED_FILE_TYPES.join(', ')} (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
          </p>
        </div>
      </div>
    </div>
  );
};