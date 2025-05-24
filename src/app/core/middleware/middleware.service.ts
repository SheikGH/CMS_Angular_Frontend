import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MiddlewareService {
  runPreconditions(): boolean {
    // Add checks: is app initialized? is config loaded?
    return true;
  }
}
