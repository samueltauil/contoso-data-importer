import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '../../ui';
import { StatusBadge } from './StatusBadge';
import type { ImportRecord } from '../../../types/import';

interface DataTableProps {
  imports: ImportRecord[];
  onViewDetails: (importRecord: ImportRecord) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ imports, onViewDetails }) => {
  if (imports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No import records found.</p>
        <p className="text-sm text-gray-400 mt-1">Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imports.map((importRecord) => (
          <TableRow key={importRecord.id}>
            <TableCell>{importRecord.id}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{importRecord.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(importRecord.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={importRecord.status} />
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(importRecord)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};