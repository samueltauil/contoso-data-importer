export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['json', 'csv', 'xlsx', 'txt'];
export const ALLOWED_MIME_TYPES = [
  'application/json',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

export const API_ENDPOINTS = {
  UPLOAD_FILE: '/api/imports/upload',
  GET_IMPORTS: '/api/imports',
  GET_IMPORT_DETAILS: '/api/imports/:id',
  RETRY_IMPORT: '/api/imports/:id/retry',
} as const;

export const STATUS_COLORS = {
  saved: 'success',
  failed: 'error',
  processing: 'warning',
} as const;

export const ROUTES = {
  DASHBOARD: '/',
  IMPORTS: '/imports',
  SETTINGS: '/settings',
} as const;