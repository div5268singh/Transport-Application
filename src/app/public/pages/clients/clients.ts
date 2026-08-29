import { Component, OnInit } from '@angular/core';
import { ClientItem } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  protected readonly clients: ClientItem[];

  constructor(
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    this.clients = appConfig.getConfig().business.clients;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      'Our Industrial Logistics Clients',
      'Review the renowned shipping and logistics clients served by our heavy industrial trucking operations team.',
    );
  }
}
