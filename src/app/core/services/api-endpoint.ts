import { Injectable } from '@angular/core';

export interface ApiRuntimeConfig {
  /** Absolute origin of the .NET API, e.g. "http://satnaroadlinesapi.runasp.net". Empty means same origin. */
  apiBaseUrl?: string;
}

/**
 * Holds the API origin so it can be changed on a deployed site by editing
 * assets/config/api.config.json - no Angular rebuild required.
 */
@Injectable({ providedIn: 'root' })
export class ApiEndpoint {
  private baseUrl = '';

  async load(): Promise<void> {
    try {
      const response = await fetch('assets/config/api.config.json', { cache: 'no-store' });
      if (response.ok) {
        const config = (await response.json()) as ApiRuntimeConfig;
        this.baseUrl = (config.apiBaseUrl ?? '').trim().replace(/\/+$/, '');
      }
    } catch {
      // Same-origin deployment (API serving wwwroot) needs no base URL.
      this.baseUrl = '';
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  /** Turns a server-relative path such as /api/content or /uploads/x.jpg into an absolute URL. */
  resolve(path: string): string {
    if (!this.baseUrl || !path || /^(https?:)?\/\//i.test(path) || path.startsWith('data:')) {
      return path;
    }

    return path.startsWith('/') ? `${this.baseUrl}${path}` : `${this.baseUrl}/${path}`;
  }
}

export function initializeApiEndpoint(apiEndpoint: ApiEndpoint): () => Promise<void> {
  return () => apiEndpoint.load();
}
