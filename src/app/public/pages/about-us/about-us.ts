import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { AppConfigModel } from '../../../core/models/app-config.model';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs implements OnInit {
<<<<<<< HEAD
  protected readonly config: AppConfigModel;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  protected readonly appName: string;
  protected readonly overview: string;
  protected readonly operationalFootprint: string[];

  constructor(
    private readonly appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    const config = this.appConfig.getConfig();
<<<<<<< HEAD
    this.config = config;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    this.appName = config.appName;
    this.overview = config.about.overview;
    this.operationalFootprint = config.about.operationalFootprint;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
<<<<<<< HEAD
      this.content('about.seoTitle'),
      this.content('about.seoDescription'),
    );
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }
=======
      'About Our Intercity Industrial Freight Network',
      'Learn how our heavy industrial trucking team moves steel, iron, and manufacturing loads safely across major corridors.',
    );
  }
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
}
