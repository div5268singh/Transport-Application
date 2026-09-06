import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig, initializeAppConfig } from './services/app-config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { adminAuthInterceptor } from './services/admin-auth-interceptor';
import { apiBaseUrlInterceptor } from './services/api-base-url-interceptor';
import { ApiEndpoint, initializeApiEndpoint } from './services/api-endpoint';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, adminAuthInterceptor])),
    // The API origin must resolve before any config or content request is made.
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApiEndpoint,
      deps: [ApiEndpoint],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppConfig],
      multi: true,
    },
  ],
})
export class CoreModule { }
