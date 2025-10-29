import React, { useState, useEffect } from 'react';
import { FileUpload } from '../features/file-upload';
import { DataTable } from '../features/data-table';
import { importService } from '../../services/importService';
import type { ImportRecord } from '../../types/import';

export const Dashboard: React.FC = () => {
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImports();
  }, []);

  const loadImports = async () => {
    try {
      setLoading(true);
      const importData = await importService.getImports();
      setImports(importData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load imports');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newImport: ImportRecord) => {
    setImports(prev => [newImport, ...prev]);
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleViewDetails = (importRecord: ImportRecord) => {
    // For now, just log the details - in a real app this would open a modal or navigate
    console.log('View details for:', importRecord);
    alert(`Details for ${importRecord.name}:\nStatus: ${importRecord.status}\nUploaded: ${importRecord.uploadedAt}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contoso Data Importer</h1>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Data Table Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading imports...</span>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <DataTable imports={imports} onViewDetails={handleViewDetails} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};