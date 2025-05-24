import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { authInterceptorProviders } from './core/interceptors/auth.interceptor';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/error/global-error-handler';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PreloadSelectedModulesStrategy } from './preload-selected-strategy';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideRouter(
      routes,
      //withPreloading(PreloadAllModules) // ✅ Correct way for standalone app
      withPreloading(PreloadSelectedModulesStrategy) // ✅ Use custom strategy
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // provideHttpClient(
    //   withInterceptors([
    //     (req, next) => new AuthInterceptor(new StorageService()).intercept(req, next)
    //   ])
    // ),
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      MatSnackBarModule,  // ✅ Proper way to import modules in standalone setup
      BrowserAnimationsModule
    ),
    ...authInterceptorProviders,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // }
  ],
};
