import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DriverAuth } from './driver-auth';

export const driverAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const driverAuth = inject(DriverAuth);
  const token = driverAuth.getToken();
  const isDriverApiRequest = req.url.startsWith('/api/driver') || req.url.includes('/api/driver');

  if (!token || !isDriverApiRequest || req.headers.has('Authorization')) {
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
