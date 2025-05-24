import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl;

  constructor(private http: HttpClient,private configService: ConfigService) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  getData(endpoint: string) {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }
  
}
