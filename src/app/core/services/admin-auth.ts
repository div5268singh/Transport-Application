import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from './app-config';

interface AdminAuthStatusResponse {
  authenticated: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuth {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly http: HttpClient,
  ) {}

  async login(password: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post<AdminAuthStatusResponse>(
        `${this.getAuthApiBaseUrl()}/login`,
        { password },
        { withCredentials: true },
      ),
    );
    return response.authenticated === true;
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${this.getAuthApiBaseUrl()}/logout`, {}, { withCredentials: true }),
    );
  }

  async isAuthenticated(): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.get<AdminAuthStatusResponse>(`${this.getAuthApiBaseUrl()}/session`, {
        withCredentials: true,
      }),
    );
    return response.authenticated === true;
  }

  private getAuthApiBaseUrl(): string {
    return this.appConfig.getConfig().admin.authApiBaseUrl?.trim() || '/api/admin';
  }
}
