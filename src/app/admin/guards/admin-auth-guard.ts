import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AdminAuth } from '../../core/services/admin-auth';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminAuth = inject(AdminAuth);
  const router = inject(Router);

  return adminAuth
    .isAuthenticated()
    .then((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      return router.createUrlTree(['/admin/login'], { queryParams: { redirectTo: state.url } });
    })
    .catch(() => {
      return router.createUrlTree(['/admin/login'], {
        queryParams: {
          redirectTo: state.url,
          authError: 'service-unavailable',
        },
      });
    });
};
