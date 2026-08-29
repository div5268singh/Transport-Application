import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfigModel } from '../models/app-config.model';

@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  private readonly overrideStorageKey = 'santa-road-config-override';
  private baseConfig: AppConfigModel | null = null;
  private config: AppConfigModel | null = null;

  constructor(private readonly http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get<AppConfigModel>('assets/config/app.config.json')).then(
      (rawBaseConfig) => {
        const baseConfig = this.normalizeConfig(rawBaseConfig);
        this.assertValidConfig(baseConfig);
        this.baseConfig = this.cloneConfig(baseConfig);
        this.config = this.getStoredOverride() ?? this.cloneConfig(baseConfig);
      },
    );
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

  saveConfigOverride(nextConfig: AppConfigModel): void {
    this.assertValidConfig(nextConfig);
    const clonedConfig = this.cloneConfig(nextConfig);
    this.config = clonedConfig;
    localStorage.setItem(this.overrideStorageKey, JSON.stringify(clonedConfig));
  }

  clearConfigOverride(): void {
    if (!this.baseConfig) {
      throw new Error('Base config not loaded. Unable to clear override.');
    }

    localStorage.removeItem(this.overrideStorageKey);
    this.config = this.cloneConfig(this.baseConfig);
  }

  private getStoredOverride(): AppConfigModel | null {
    const rawOverride = localStorage.getItem(this.overrideStorageKey);
    if (!rawOverride) {
      return null;
    }

    try {
      const parsedOverride = this.normalizeConfig(JSON.parse(rawOverride) as AppConfigModel);
      this.assertValidConfig(parsedOverride);
      return this.cloneConfig(parsedOverride);
    } catch (error) {
      console.warn('Ignoring invalid stored config override and restoring base config.', error);
      localStorage.removeItem(this.overrideStorageKey);
      return null;
    }
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

  private normalizeConfig(config: AppConfigModel): AppConfigModel {
    const normalized = this.cloneConfig(config);
    normalized.contact.leadEmail = normalized.contact.leadEmail ?? normalized.contact.email;
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
}

export function initializeAppConfig(appConfig: AppConfig): () => Promise<void> {
  return () => appConfig.loadConfig();
}
