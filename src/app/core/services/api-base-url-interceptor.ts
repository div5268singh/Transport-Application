import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';

/** Sends every server-relative /api request to the configured API origin. */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  const resolved = inject(ApiEndpoint).resolve(request.url);
  return next(resolved === request.url ? request : request.clone({ url: resolved }));
};
