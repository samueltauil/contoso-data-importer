import React from 'react';
import { Badge } from '../../ui';
import type { ImportRecord } from '../../../types/import';

interface StatusBadgeProps {
  status: ImportRecord['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getVariant = (status: ImportRecord['status']) => {
    switch (status) {
      case 'saved':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getLabel = (status: ImportRecord['status']) => {
    switch (status) {
      case 'saved':
        return 'Saved';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {getLabel(status)}
    </Badge>
  );
};