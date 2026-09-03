import { Component, OnInit } from '@angular/core';
import { AppConfigModel } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs implements OnInit {
  protected readonly config: AppConfigModel;
  protected readonly appName: string;
  protected readonly overview: string;
  protected readonly operationalFootprint: string[];

  constructor(
    private readonly appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    const config = this.appConfig.getConfig();
    this.config = config;
    this.appName = config.appName;
    this.overview = config.about.overview;
    this.operationalFootprint = config.about.operationalFootprint;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      this.content('about.seoTitle'),
      this.content('about.seoDescription'),
    );
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }
}
