import { notFound } from 'next/navigation';

/**
 * Admin özelliklerinin (route handler'lar, sayfalar) yalnızca yerel
 * geliştirmede çalışmasını sağlayan tek doğruluk kaynağı. Production'da
 * (`NODE_ENV === 'production'`) çağrıldığında `notFound()` fırlatır ve
 * isteği 404 ile sonlandırır. Development/test ortamlarında hiçbir şey
 * yapmaz.
 */
export function assertAdminEnabled(): void {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
}
