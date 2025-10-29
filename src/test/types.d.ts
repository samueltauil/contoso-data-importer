/// <reference types="vitest/globals" />

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

export {};