import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { ConsignmentList } from './pages/consignment-list/consignment-list';
import { ConsignmentCreate } from './pages/consignment-create/consignment-create';
import { ConsignmentDetail } from './pages/consignment-detail/consignment-detail';


@NgModule({
  declarations: [
    AdminLogin,
    AdminDashboard,
    ConsignmentList,
    ConsignmentCreate,
    ConsignmentDetail,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
