import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth-guard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminLogin } from './pages/admin-login/admin-login';
import { ConsignmentList } from './pages/consignment-list/consignment-list';
import { ConsignmentCreate } from './pages/consignment-create/consignment-create';
import { ConsignmentDetail } from './pages/consignment-detail/consignment-detail';

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
  {
    path: 'consignments',
    component: ConsignmentList,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'consignments/new',
    component: ConsignmentCreate,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'consignments/:id',
    component: ConsignmentDetail,
    canActivate: [adminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
