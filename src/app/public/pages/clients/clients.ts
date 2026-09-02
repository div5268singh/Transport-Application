import { Component, OnInit } from '@angular/core';
import { AppConfigModel, ClientItem } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  protected readonly config: AppConfigModel;
  protected readonly clients: ClientItem[];

  constructor(
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    this.config = appConfig.getConfig();
    this.clients = this.config.business.clients;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      this.content('clients.seoTitle'),
      this.content('clients.seoDescription'),
    );
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }
}
