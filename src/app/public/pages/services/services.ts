import { Component, OnInit } from '@angular/core';
import { ServiceItem } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  protected readonly services: ServiceItem[];

  constructor(
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    this.services = appConfig.getConfig().business.services;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      'Industrial Transport Services Portfolio',
      'Explore trailer transport, over dimension hauling, container movement, and warehousing services for heavy industrial freight.',
    );
  }
}
