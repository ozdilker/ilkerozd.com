import { describe, it, expect, afterEach, vi } from 'vitest';
import { assertAdminEnabled } from './adminGuard';

// `NODE_ENV`, Next.js'in global.d.ts'inde `readonly` olarak tiplenir; testte
// geçici olarak değiştirmek için doğrudan atama yerine `vi.stubEnv` kullanılır
// (tsc-safe) ve her testten sonra `vi.unstubAllEnvs` ile eski haline dönülür.
describe('assertAdminEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('production ortamında throw eder (notFound)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => assertAdminEnabled()).toThrow();
  });

  it('development ortamında sorunsuz geçer (throw etmez)', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => assertAdminEnabled()).not.toThrow();
  });

  it('test ortamında sorunsuz geçer (throw etmez)', () => {
    vi.stubEnv('NODE_ENV', 'test');
    expect(() => assertAdminEnabled()).not.toThrow();
  });
});
