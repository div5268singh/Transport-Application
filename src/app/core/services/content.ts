import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SiteContentResponse {
  jsonData: string;
  updatedAt: string;
}

export interface MediaUploadResponse {
  url: string;
  fileName: string;
}

export interface MediaItem {
  url: string;
  fileName: string;
  sizeInBytes: number;
  contentType: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly base = '/api/content';
  private readonly mediaBase = '/api/media';

  constructor(private readonly http: HttpClient) {}

  // AppConfig refreshes its browser cache from this database-backed endpoint.
  get(): Observable<SiteContentResponse> {
    return this.http.get<SiteContentResponse>(this.base);
  }

  // Admin saves the complete configuration document as one database record.
  save(jsonData: string): Observable<SiteContentResponse> {
    return this.http.put<SiteContentResponse>(this.base, { jsonData });
  }

  // Returns an opaque /api/media/{id} URL to store in a banner/service/video field.
  uploadMedia(file: File): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaUploadResponse>(this.mediaBase, formData);
  }

  // Everything already uploaded to the API server's media folder.
  listMedia(): Observable<MediaItem[]> {
    return this.http.get<MediaItem[]>(this.mediaBase);
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.mediaBase}/${encodeURIComponent(id)}`);
  }
}
