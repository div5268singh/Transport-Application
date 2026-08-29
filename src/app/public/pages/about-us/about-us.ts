import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs implements OnInit {
  protected readonly appName: string;
  protected readonly overview: string;
  protected readonly operationalFootprint: string[];

  constructor(
    private readonly appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    const config = this.appConfig.getConfig();
    this.appName = config.appName;
    this.overview = config.about.overview;
    this.operationalFootprint = config.about.operationalFootprint;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      'About Our Intercity Industrial Freight Network',
      'Learn how our heavy industrial trucking team moves steel, iron, and manufacturing loads safely across major corridors.',
    );
  }
}
