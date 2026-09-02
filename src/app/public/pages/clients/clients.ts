import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { AppConfigModel, ClientItem } from '../../../core/models/app-config.model';
=======
import { ClientItem } from '../../../core/models/app-config.model';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
<<<<<<< HEAD
  protected readonly config: AppConfigModel;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  protected readonly clients: ClientItem[];

  constructor(
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
<<<<<<< HEAD
    this.config = appConfig.getConfig();
    this.clients = this.config.business.clients;
=======
    this.clients = appConfig.getConfig().business.clients;
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
<<<<<<< HEAD
      this.content('clients.seoTitle'),
      this.content('clients.seoDescription'),
    );
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }
=======
      'Our Industrial Logistics Clients',
      'Review the renowned shipping and logistics clients served by our heavy industrial trucking operations team.',
    );
  }
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
}
