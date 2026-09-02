<<<<<<< HEAD
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
=======
import { HttpClient } from '@angular/common/http';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from './app-config';

interface AdminAuthStatusResponse {
  authenticated: boolean;
<<<<<<< HEAD
  username: string;
}

interface AdminLoginResponse {
  token: string;
  expiresAt: string;
  username: string;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuth {
<<<<<<< HEAD
  private static readonly tokenStorageKey = 'santa-road-admin-jwt';

=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  constructor(
    private readonly appConfig: AppConfig,
    private readonly http: HttpClient,
  ) {}

<<<<<<< HEAD
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
=======
  async login(password: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post<AdminAuthStatusResponse>(
        `${this.getAuthApiBaseUrl()}/login`,
        { password },
        { withCredentials: true },
      ),
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    );
    return response.authenticated === true;
  }

<<<<<<< HEAD
  getToken(): string | null {
    return sessionStorage.getItem(AdminAuth.tokenStorageKey);
=======
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
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  }

  private getAuthApiBaseUrl(): string {
    return this.appConfig.getConfig().admin.authApiBaseUrl?.trim() || '/api/admin';
  }
}
