import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;
  //private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http
      .get('/assets/config/runtime-config.json')
      .toPromise()
      .then(config => {
        this.config = config;
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl;
  }
  get apiBaseUrl(): string {
    return environment.apiUrl;
  }
  get isProduction(): boolean {
    return this.config?.production;
  }
}
