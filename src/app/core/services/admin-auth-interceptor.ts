import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuth } from './admin-auth';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const adminAuth = inject(AdminAuth);
  const token = adminAuth.getToken();
  const isApiRequest = req.url.startsWith('/api/') || req.url.includes('/api/');

  if (!token || !isApiRequest) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
