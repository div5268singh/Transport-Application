import { Routes } from '@angular/router';
import { driverAuthGuard } from './guards/driver-auth-guard';
import { DriverLogin } from './pages/driver-login/driver-login';
import { DriverConsignmentPage } from './pages/driver-consignment/driver-consignment';

export const DRIVER_ROUTES: Routes = [
  {
    path: 'login',
    component: DriverLogin,
  },
  {
    path: 'consignment',
    component: DriverConsignmentPage,
    canActivate: [driverAuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
