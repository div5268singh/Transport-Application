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

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly base = '/api/content';

  constructor(private readonly http: HttpClient) {}

  // AppConfig refreshes its browser cache from this database-backed endpoint.
  get(): Observable<SiteContentResponse> {
    return this.http.get<SiteContentResponse>(this.base);
  }

  // Admin saves the complete configuration document as one database record.
  save(jsonData: string): Observable<SiteContentResponse> {
    return this.http.put<SiteContentResponse>(this.base, { jsonData });
  }

  // Replaces StorageSimulator's base64/localStorage upload — returns a
  // real /uploads/... URL to store in a banner/service/video field.
  uploadMedia(file: File): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaUploadResponse>(`${this.base}/media`, formData);
  }
}
