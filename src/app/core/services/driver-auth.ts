import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConsignmentService } from './consignment';

@Injectable({
  providedIn: 'root',
})
export class DriverAuth {
  private static readonly tokenStorageKey = 'santa-road-driver-jwt';

  constructor(private readonly consignmentService: ConsignmentService) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.consignmentService.driverLogin({ username, password }));

      if (!response.token) {
        return false;
      }

      sessionStorage.setItem(DriverAuth.tokenStorageKey, response.token);
      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        return false;
      }
      throw error;
    }
  }

  logout(): void {
    sessionStorage.removeItem(DriverAuth.tokenStorageKey);
  }

  getToken(): string | null {
    return sessionStorage.getItem(DriverAuth.tokenStorageKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
