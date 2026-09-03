import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from './app-config';

interface AdminAuthStatusResponse {
  authenticated: boolean;
  username: string;
}

interface AdminLoginResponse {
  token: string;
  expiresAt: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuth {
  private static readonly tokenStorageKey = 'santa-road-admin-jwt';

  constructor(
    private readonly appConfig: AppConfig,
    private readonly http: HttpClient,
  ) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AdminLoginResponse>(
          `${this.getAuthApiBaseUrl()}/login`,
          { username, password },
        ),
      );

      if (!response.token) {
        return false;
      }

      // sessionStorage clears when the browser/tab closes, forcing re-login next visit.
      sessionStorage.setItem(AdminAuth.tokenStorageKey, response.token);
      return true;
    } catch (error) {
      // Wrong credentials are a normal login outcome, not a service failure.
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return false;
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<void>(`${this.getAuthApiBaseUrl()}/logout`, {}));
    } finally {
      sessionStorage.removeItem(AdminAuth.tokenStorageKey);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.getToken()) {
      return false;
    }

    const response = await firstValueFrom(
      this.http.get<AdminAuthStatusResponse>(`${this.getAuthApiBaseUrl()}/session`),
    );
    return response.authenticated === true;
  }

  getToken(): string | null {
    return sessionStorage.getItem(AdminAuth.tokenStorageKey);
  }

  private getAuthApiBaseUrl(): string {
    return this.appConfig.getConfig().admin.authApiBaseUrl?.trim() || '/api/admin';
  }
}
