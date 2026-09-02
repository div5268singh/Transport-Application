import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfigModel } from '../models/app-config.model';
import { ContentService } from './content';

@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  private readonly cacheKey = 'santa-road-site-content';
  private baseConfig: AppConfigModel | null = null;
  private config: AppConfigModel | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly contentService: ContentService,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key === this.cacheKey && event.newValue) {
        window.location.reload();
      }
    });
  }

  async loadConfig(): Promise<void> {
    const rawBaseConfig = await firstValueFrom(this.http.get<AppConfigModel>('assets/config/app.config.json'));
    const baseConfig = this.normalizeConfig(rawBaseConfig);
    this.assertValidConfig(baseConfig);
    this.baseConfig = this.cloneConfig(baseConfig);

    const cachedConfig = this.readCachedConfig(baseConfig);
    if (cachedConfig) {
      this.applyConfig(cachedConfig);
    }

    try {
      const storedResponse = await firstValueFrom(this.contentService.get());
      if (storedResponse.jsonData?.trim()) {
        const storedConfig = JSON.parse(storedResponse.jsonData) as Partial<AppConfigModel>;
        const parsedOverride = this.normalizeConfig(this.mergeConfig(baseConfig, storedConfig));
        this.assertValidConfig(parsedOverride);
        this.applyConfig(parsedOverride);
        this.cacheConfig(parsedOverride);
        return;
      }
    } catch (error) {
      console.warn('Could not load CMS content from API. Falling back to bundled config.', error);
    }

    if (!this.config) {
      this.applyConfig(baseConfig);
      this.cacheConfig(baseConfig);
    }
  }

  getConfig(): AppConfigModel {
    if (!this.config) {
      throw new Error('Application config not loaded. Ensure APP_INITIALIZER finished correctly.');
    }

    return this.config;
  }

  getEditableConfig(): AppConfigModel {
    return this.cloneConfig(this.getConfig());
  }

  async saveConfigOverride(nextConfig: AppConfigModel): Promise<void> {
    const normalizedConfig = this.normalizeConfig(nextConfig);
    this.assertValidConfig(normalizedConfig);
    const clonedConfig = this.cloneConfig(normalizedConfig);
    await firstValueFrom(this.contentService.save(JSON.stringify(clonedConfig)));
    this.applyConfig(clonedConfig);
    this.cacheConfig(clonedConfig);
  }

  async clearConfigOverride(): Promise<void> {
    if (!this.baseConfig) {
      throw new Error('Base config not loaded. Unable to clear override.');
    }

    await this.saveConfigOverride(this.baseConfig);
  }

  private assertValidConfig(config: AppConfigModel): void {
    if (!config.appName?.trim()) {
      throw new Error('Invalid config: appName is required.');
    }
    if (!config.contact?.phone?.trim()) {
      throw new Error('Invalid config: contact.phone is required.');
    }
    if (!config.contact?.email?.trim()) {
      throw new Error('Invalid config: contact.email is required.');
    }
    if (!(config.contact?.leadEmail ?? config.contact?.email)?.trim()) {
      throw new Error('Invalid config: contact.leadEmail is required.');
    }
    if (!config.brand?.logoPath?.trim()) {
      throw new Error('Invalid config: brand.logoPath is required.');
    }
    if (!Array.isArray(config.homepage?.banners)) {
      throw new Error('Invalid config: homepage.banners must be an array.');
    }
    if (!Array.isArray(config.business?.clients)) {
      throw new Error('Invalid config: business.clients must be an array.');
    }
    if (!config.admin) {
      throw new Error('Invalid config: admin section is required.');
    }
  }

  private cloneConfig(config: AppConfigModel): AppConfigModel {
    return JSON.parse(JSON.stringify(config)) as AppConfigModel;
  }

  private mergeConfig(base: AppConfigModel, override: Partial<AppConfigModel>): AppConfigModel {
    return {
      ...base,
      ...override,
      brand: { ...base.brand, ...override.brand },
      contact: { ...base.contact, ...override.contact },
      content: { ...base.content, ...override.content },
      seo: { ...base.seo, ...override.seo },
      homepage: { ...base.homepage, ...override.homepage },
      about: { ...base.about, ...override.about },
      business: { ...base.business, ...override.business },
      admin: { ...base.admin, ...override.admin },
    };
  }

  private normalizeConfig(config: AppConfigModel): AppConfigModel {
    const normalized = this.cloneConfig(config);
    normalized.contact.leadEmail = normalized.contact.leadEmail ?? normalized.contact.email;
    normalized.content = normalized.content ?? {};
    normalized.homepage.banners = normalized.homepage.banners ?? [];
    normalized.homepage.posters = normalized.homepage.posters ?? [];
    normalized.homepage.videos = normalized.homepage.videos ?? [];
    normalized.business.services = normalized.business.services ?? [];
    normalized.business.features = normalized.business.features ?? [];
    normalized.business.clients = normalized.business.clients ?? [];
    normalized.admin = normalized.admin ?? {};
    if (normalized.admin.authApiBaseUrl?.trim()) {
      normalized.admin.authApiBaseUrl = normalized.admin.authApiBaseUrl.trim();
    }
    return normalized;
  }

  private applyConfig(config: AppConfigModel): void {
    const clonedConfig = this.cloneConfig(config);
    if (this.config) {
      Object.assign(this.config, clonedConfig);
      return;
    }
    this.config = clonedConfig;
  }

  private cacheConfig(config: AppConfigModel): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(config));
  }

  private readCachedConfig(baseConfig: AppConfigModel): AppConfigModel | null {
    const cachedJson = localStorage.getItem(this.cacheKey);
    if (!cachedJson) {
      return null;
    }

    try {
      const cachedConfig = this.normalizeConfig(
        this.mergeConfig(baseConfig, JSON.parse(cachedJson) as Partial<AppConfigModel>),
      );
      this.assertValidConfig(cachedConfig);
      return cachedConfig;
    } catch {
      localStorage.removeItem(this.cacheKey);
      return null;
    }
  }
}

export function initializeAppConfig(appConfig: AppConfig): () => Promise<void> {
  return () => appConfig.loadConfig();
}
