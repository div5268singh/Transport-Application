import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AppConfigModel,
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
  protected readonly config: AppConfigModel;
  protected readonly appName: string;
  protected readonly contactPhone: string;
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
    this.config = config;
    this.appName = config.appName;
    this.contactPhone = config.contact.phone;
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
        imagePath: '/uploads/home-hero-truck.jpg',
        ctaText: 'Read More',
      };
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      this.content('home.seoTitle'),
      this.content('home.seoDescription'),
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

  protected content(key: string): string {
    return this.config.content[key] ?? '';
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
