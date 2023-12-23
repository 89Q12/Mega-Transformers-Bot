import { describe, it, expect, vi } from 'vitest';
import { normalizeUrlMiddleware } from './normalize-url-middleware.tsx';

describe('normalizeUrlMiddleware', () => {
  it('should remove double slash from http url', () => {
    const next = vi.fn();
    normalizeUrlMiddleware(next)('http://localhost:3000//path/to/endpoint', {});
    expect(next).toBeCalledWith('http://localhost:3000/path/to/endpoint', {});
  });

  it('should remove double slash from https url', () => {
    const next = vi.fn();
    normalizeUrlMiddleware(next)(
      'https://localhost:3000//path/to/endpoint',
      {},
    );
    expect(next).toBeCalledWith('https://localhost:3000/path/to/endpoint', {});
  });

  it('should keep single slash at http url', () => {
    const next = vi.fn();
    normalizeUrlMiddleware(next)('http://localhost:3000/path/to/endpoint', {});
    expect(next).toBeCalledWith('http://localhost:3000/path/to/endpoint', {});
  });

  it('should not modify the url when there is no path and no trailing slash', () => {
    const next = vi.fn();
    normalizeUrlMiddleware(next)('http://localhost:3000', {});
    expect(next).toBeCalledWith('http://localhost:3000', {});
  });

  it('should no modify the url when there is no path and a trailing slash', () => {
    const next = vi.fn();
    normalizeUrlMiddleware(next)('http://localhost:3000/', {});
    expect(next).toBeCalledWith('http://localhost:3000/', {});
  });
});
