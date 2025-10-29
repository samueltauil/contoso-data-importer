import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock File API
(globalThis as unknown as { File: unknown }).File = class File {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor(fileBits: string[], fileName: string, options?: { type?: string }) {
    this.name = fileName;
    this.size = fileBits.join('').length;
    this.type = options?.type || '';
    this.lastModified = Date.now();
  }
};

(globalThis as unknown as { FileReader: unknown }).FileReader = class FileReader {
  result: string | null = null;
  error: Error | null = null;
  readyState: number = 0;
  
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
  
  readAsText() {
    this.readyState = 2;
    this.result = 'test file content';
  }
  
  readAsDataURL() {
    this.readyState = 2;
    this.result = 'data:text/plain;base64,dGVzdCBmaWxlIGNvbnRlbnQ=';
  }
};