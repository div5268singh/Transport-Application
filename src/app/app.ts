import { Component } from '@angular/core';
import { AppConfig } from './core/services/app-config';
import { AppConfigModel } from './core/models/app-config.model';

interface NavigationLink {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly appConfig: AppConfigModel;
  protected readonly currentYear = new Date().getFullYear();
<<<<<<< HEAD
  protected isNavigationOpen = false;
=======
  protected readonly navigationLinks: NavigationLink[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/clients', label: 'Our Clients' },
    { path: '/contact', label: 'Contact' },
  ];
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

  constructor(appConfigService: AppConfig) {
    this.appConfig = appConfigService.getConfig();
  }
<<<<<<< HEAD

  protected get navigationLinks(): NavigationLink[] {
    return [
      { path: '/', label: this.content('shell.nav.home') },
      { path: '/about', label: this.content('shell.nav.about') },
      { path: '/services', label: this.content('shell.nav.services') },
      { path: '/track', label: this.content('shell.nav.tracking') },
      { path: '/clients', label: this.content('shell.nav.clients') },
      { path: '/contact', label: this.content('shell.nav.contact') },
    ];
  }

  protected content(key: string): string {
    return this.appConfig.content[key] ?? '';
  }

  protected toggleNavigation(): void {
    this.isNavigationOpen = !this.isNavigationOpen;
  }

  protected closeNavigation(): void {
    this.isNavigationOpen = false;
  }
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
}
