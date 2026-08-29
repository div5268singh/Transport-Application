import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BannerContent,
  ClientItem,
  FeatureItem,
  ServiceItem,
  VideoContent,
} from '../../../core/models/app-config.model';
import { Api } from '../../../core/services/api';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  protected readonly appName: string;
  protected readonly heroHeading: string;
  protected readonly heroSubheading: string;
  protected activeHeroIndex = 0;
  protected activeHero: BannerContent;
  protected services: ServiceItem[] = [];
  protected features: FeatureItem[] = [];
  protected clients: ClientItem[] = [];
  protected videos: VideoContent[] = [];
  protected banners: BannerContent[] = [];
  private carouselTimerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly api: Api,
    private readonly appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    const config = this.appConfig.getConfig();
    this.appName = config.appName;
    this.heroHeading = config.homepage.heroHeading;
    this.heroSubheading = config.homepage.heroSubheading;
    this.banners = config.homepage.banners;
    this.services = config.business.services.slice(0, 6);
    this.features = config.business.features;
    this.clients = config.business.clients.slice(0, 4);
    this.videos = this.api.getVideoContent();
    this.activeHero =
      this.banners[0] ?? {
        title: this.heroHeading,
        subtitle: this.heroSubheading,
        imagePath: 'assets/media/hero-1.svg',
        ctaText: 'Read More',
      };
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      'Heavy Industrial Trucking and Raw Material Logistics',
      'Book reliable city-to-city transport for steel, iron, and high-tonnage factory raw materials with live fleet coordination.',
    );
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselTimerId) {
      clearInterval(this.carouselTimerId);
    }
  }

  protected setActiveBanner(index: number): void {
    if (this.banners.length === 0) {
      return;
    }

    this.activeHeroIndex = index;
    this.activeHero = this.banners[index];
  }

  private startCarousel(): void {
    if (this.banners.length < 2) {
      return;
    }

    this.carouselTimerId = setInterval(() => {
      const nextIndex = (this.activeHeroIndex + 1) % this.banners.length;
      this.setActiveBanner(nextIndex);
    }, 5000);
  }
}
