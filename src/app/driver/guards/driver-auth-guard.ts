import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DriverAuth } from '../../core/services/driver-auth';

export const driverAuthGuard: CanActivateFn = (_route, state) => {
  const driverAuth = inject(DriverAuth);
  const router = inject(Router);

  if (driverAuth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/driver/login'], {
    queryParams: { redirectTo: state.url },
  });
};
