import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiEndpoint } from './api-endpoint';

/**
 * Downloads media from the API and hands back an object URL, so the rendered
 * markup never contains the API address or the stored file name.
 */
@Injectable({ providedIn: 'root' })
export class MediaLoader implements OnDestroy {
  private readonly cache = new Map<string, Promise<string>>();
  private readonly objectUrls = new Set<string>();

  constructor(
    private readonly http: HttpClient,
    private readonly apiEndpoint: ApiEndpoint,
  ) {}

  /** Returns a blob: URL for an API-hosted path, or the original value for anything else. */
  async load(path: string | null | undefined): Promise<string> {
    const endpoint = this.toApiEndpoint(path);
    if (!endpoint) {
      return path ?? '';
    }

    let pending = this.cache.get(endpoint);
    if (!pending) {
      pending = this.fetchAsObjectUrl(endpoint);
      this.cache.set(endpoint, pending);
    }

    try {
      return await pending;
    } catch {
      // A missing or unreachable file should not retry forever on every render.
      this.cache.delete(endpoint);
      return '';
    }
  }

  ngOnDestroy(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls.clear();
    this.cache.clear();
  }

  /**
   * Normalises both the current /api/media/{id} form and the legacy
   * /uploads/{name}.{ext} values still stored in older content documents.
   */
  private toApiEndpoint(path: string | null | undefined): string | null {
    const value = path?.trim();
    if (!value) {
      return null;
    }

    if (value.startsWith('/api/media/')) {
      return value;
    }

    if (value.startsWith('/uploads/')) {
      const fileName = value.slice('/uploads/'.length);
      const id = fileName.replace(/\.[^./]+$/, '');
      return id ? `/api/media/${id}` : null;
    }

    return null;
  }

  private async fetchAsObjectUrl(endpoint: string): Promise<string> {
    const blob = await firstValueFrom(
      this.http.get(this.apiEndpoint.resolve(endpoint), { responseType: 'blob' }),
    );
    const objectUrl = URL.createObjectURL(blob);
    this.objectUrls.add(objectUrl);
    return objectUrl;
  }
}
