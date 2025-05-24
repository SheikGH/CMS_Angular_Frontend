import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  logError(message : string , error: any): void {
    // Send to server or log to file
    console.log(message || 'Logged Error:', error);
  }

  logEvent(message : string ,event: any): void {
    console.log(message || 'Event:', event);
  }
}
