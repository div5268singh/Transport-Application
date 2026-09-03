import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUs } from './pages/about-us/about-us';
import { Clients } from './pages/clients/clients';
import { ContactUs } from './pages/contact-us/contact-us';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { ShipmentTracking } from './pages/shipment-tracking/shipment-tracking';

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
  {
    path: 'track',
    component: ShipmentTracking,
  },
  {
    path: 'track/:consignmentNumber',
    component: ShipmentTracking,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
