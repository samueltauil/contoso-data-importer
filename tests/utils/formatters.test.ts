import { describe, it, expect } from 'vitest';
import { formatFileSize, formatDateTime, getFileExtension, isValidFileType, cn } from '../../src/utils/formatters';

describe('Utility Functions', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('handles decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });
  });

  describe('formatDateTime', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-10-27T10:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Oct 27, 2024/);
      expect(formatted).toMatch(/10:30/);
    });
  });

  describe('getFileExtension', () => {
    it('extracts file extension correctly', () => {
      expect(getFileExtension('test.json')).toBe('json');
      expect(getFileExtension('data.csv')).toBe('csv');
      expect(getFileExtension('file.name.xlsx')).toBe('xlsx');
    });

    it('handles files without extension', () => {
      expect(getFileExtension('README')).toBe('');
    });
  });

  describe('isValidFileType', () => {
    it('validates file types correctly', () => {
      const jsonFile = new File(['{}'], 'test.json', { type: 'application/json' });
      const csvFile = new File([''], 'test.csv', { type: 'text/csv' });
      const txtFile = new File([''], 'test.txt', { type: 'text/plain' });
      
      expect(isValidFileType(jsonFile, ['json', 'csv'])).toBe(true);
      expect(isValidFileType(csvFile, ['json', 'csv'])).toBe(true);
      expect(isValidFileType(txtFile, ['json', 'csv'])).toBe(false);
    });

    it('validates by MIME type', () => {
      const file = new File(['{}'], 'test.json', { type: 'application/json' });
      expect(isValidFileType(file, ['application/json'])).toBe(true);
    });
  });

  describe('cn (className utility)', () => {
    it('merges classes correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const condition1 = true;
      const condition2 = false;
      expect(cn('base', condition1 && 'conditional', condition2 && 'hidden')).toBe('base conditional');
    });

    it('handles Tailwind conflicts', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4'); // Later class wins
    });
  });
});