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
  protected readonly navigationLinks: NavigationLink[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/clients', label: 'Our Clients' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor(appConfigService: AppConfig) {
    this.appConfig = appConfigService.getConfig();
  }
}
