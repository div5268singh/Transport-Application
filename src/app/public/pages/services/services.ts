import { Component, OnInit } from '@angular/core';
import { AppConfigModel, ServiceItem } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  protected readonly config: AppConfigModel;
  protected readonly services: ServiceItem[];

  constructor(
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    this.config = appConfig.getConfig();
    this.services = this.config.business.services;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      this.content('services.seoTitle'),
      this.content('services.seoDescription'),
    );
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }
}
