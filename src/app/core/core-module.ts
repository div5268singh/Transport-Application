import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig, initializeAppConfig } from './services/app-config';
<<<<<<< HEAD
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { adminAuthInterceptor } from './services/admin-auth-interceptor';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
<<<<<<< HEAD
    provideHttpClient(withInterceptors([adminAuthInterceptor])),
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppConfig],
      multi: true,
    }
  ],
})
export class CoreModule { }
