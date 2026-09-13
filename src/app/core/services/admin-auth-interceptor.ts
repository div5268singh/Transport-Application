import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuth } from './admin-auth';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const adminAuth = inject(AdminAuth);
  const token = adminAuth.getToken();
  const isApiRequest = req.url.startsWith('/api/') || req.url.includes('/api/');
  const isDriverApiRequest = req.url.startsWith('/api/driver') || req.url.includes('/api/driver');

  if (!token || !isApiRequest || isDriverApiRequest || req.headers.has('Authorization')) {
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
