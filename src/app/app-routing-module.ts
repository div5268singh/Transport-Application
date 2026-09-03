import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public-module').then((m) => m.PublicModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  // useHash avoids GitHub Pages 404s on deep-link/refresh since there's no server rewrite rule
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
