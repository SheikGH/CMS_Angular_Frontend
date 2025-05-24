import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoggingService } from '../services/logging.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private notify: NotificationService) {}

  handleError(error: any): void {
    const router = this.injector.get(Router);
    let errMessage = 'Global Error Handler:';
    if (error instanceof HttpErrorResponse) {
      errMessage ='HTTP Error:';
    } else {
      errMessage ='Global Error Handler:';
    }

    // Optional: redirect or show toast
    // router.navigate(['/error']);
    const logger = this.injector.get(LoggingService);
    logger.logError(errMessage, error);

    // Log to external server or show user-friendly message
    console.error(errMessage, error);
  }
  
}
