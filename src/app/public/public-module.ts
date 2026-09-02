import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing-module';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import { ContactUs } from './pages/contact-us/contact-us';
import { SharedModule } from '../shared/shared-module';
import { Services } from './pages/services/services';
import { Clients } from './pages/clients/clients';
<<<<<<< HEAD
import { ShipmentTracking } from './pages/shipment-tracking/shipment-tracking';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e


@NgModule({
  declarations: [
    Home,
    AboutUs,
    ContactUs,
    Services,
<<<<<<< HEAD
    Clients,
    ShipmentTracking
=======
    Clients
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PublicModule { }
