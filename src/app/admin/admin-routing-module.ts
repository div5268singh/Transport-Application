import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth-guard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminLogin } from './pages/admin-login/admin-login';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLogin,
  },
  {
    path: '',
    component: AdminDashboard,
    canActivate: [adminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
