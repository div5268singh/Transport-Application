import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
<<<<<<< HEAD
import { ConsignmentList } from './pages/consignment-list/consignment-list';
import { ConsignmentCreate } from './pages/consignment-create/consignment-create';
import { ConsignmentDetail } from './pages/consignment-detail/consignment-detail';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e


@NgModule({
  declarations: [
    AdminLogin,
<<<<<<< HEAD
    AdminDashboard,
    ConsignmentList,
    ConsignmentCreate,
    ConsignmentDetail,
=======
    AdminDashboard
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
