import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUs } from './pages/about-us/about-us';
import { Clients } from './pages/clients/clients';
import { ContactUs } from './pages/contact-us/contact-us';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
<<<<<<< HEAD
import { ShipmentTracking } from './pages/shipment-tracking/shipment-tracking';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'about',
    component: AboutUs,
  },
  {
    path: 'contact',
    component: ContactUs,
  },
  {
    path: 'services',
    component: Services,
  },
  {
    path: 'clients',
    component: Clients,
  },
<<<<<<< HEAD
  {
    path: 'track',
    component: ShipmentTracking,
  },
  {
    path: 'track/:consignmentNumber',
    component: ShipmentTracking,
  },
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
