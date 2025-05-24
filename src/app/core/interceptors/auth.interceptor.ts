import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';
import { LoggingService } from '../services/logging.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService, private notify: NotificationService,
    private logger: LoggingService, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = isPlatformBrowser(this.platformId) ? this.storageService.getUser()?.token : null;


    // 🔐 URLs to exclude
    const excludedUrls = ['login', 'register'];

    // ✅ Skip interceptor for excluded URLs
    const shouldSkip = excludedUrls.some(url => req.url.toLowerCase().includes(url));

    if (shouldSkip) {
      return next.handle(req).pipe(
        catchError(this.handleError)
        // catchError(err => { if (err.status === 0) { this.notify.error('No connection to server'); }
        //   else { this.notify.error(`Error ${err.status}: ${err.statusText}`); } this.logger.logError(err); return throwError(() => err); })
        );
    }

    //console.log(`AuthInterceptor::token:${token}`);
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      //return next.handle(cloned);
      return next.handle(cloned).pipe(
        catchError(this.handleError)
      );
    }
    else{
      this.notify.warn('Unauthorized Access');
      this.router.navigate(['/login']);   
    }
    //return next.handle(req);
    return next.handle(req).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong in Interceptor. Please try again.'
    // You can use a notification/snackbar service here
    if (err.status === 0) {
      errorMessage = 'No connection to server';
    } else if (err.status === 401) {
      errorMessage = 'Unauthorized access';
    } else if (err.status === 500) {
      errorMessage = 'Server error occurred';
    } else {
      errorMessage = `Error ${err.status}: ${err.statusText}`;
    }
    this.notify.error(errorMessage);
    this.logger.logError(errorMessage || 'Something went wrong in Interceptor. Please try again.', err);
    console.error(errorMessage || 'Something went wrong in Interceptor. Please try again.', err);
    return throwError(() => new Error(errorMessage || 'Something went wrong. Please try again.' + err));
  }
}

// Provider for interceptor
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
