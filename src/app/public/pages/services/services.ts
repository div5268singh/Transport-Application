import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { AppConfigModel, ServiceItem } from '../../../core/models/app-config.model';
=======
import { ServiceItem } from '../../../core/models/app-config.model';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
<<<<<<< HEAD
  protected readonly config: AppConfigModel;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  protected readonly services: ServiceItem[];

  constructor(
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
<<<<<<< HEAD
    this.config = appConfig.getConfig();
    this.services = this.config.business.services;
=======
    this.services = appConfig.getConfig().business.services;
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
<<<<<<< HEAD
      this.content('services.seoTitle'),
      this.content('services.seoDescription'),
    );
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }
=======
      'Industrial Transport Services Portfolio',
      'Explore trailer transport, over dimension hauling, container movement, and warehousing services for heavy industrial freight.',
    );
  }
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
}
