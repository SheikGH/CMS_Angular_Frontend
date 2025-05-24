import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../models/user.model';
import { StorageService } from '@core';
import { ConfigService } from 'app/core/services/config.service';
import { Register } from '../models/register.model';
import { LoggingService } from 'app/core/services/logging.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private AUTH_API: string;
  constructor(private http: HttpClient, private router: Router, private storageService: StorageService, private configService: ConfigService, private logger: LoggingService) {
    this.AUTH_API = `${this.configService.apiBaseUrl}/auth`;
  }

  login(user: User): Observable<any> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, user, httpOptions).pipe(
      catchError(err => this.handleError(err, 'Could not login customer'))
    );
  }

  register(register: Register): Observable<any> {
    return this.http.post(this.AUTH_API + '/register', register, httpOptions).pipe(
      catchError(err => this.handleError(err, 'Could not register customer'))
    );
  }

  // logout() {
  //   localStorage.removeItem('jwtToken');
  //   localStorage.removeItem('roles');
  //   this.router.navigate(['/login']);
  // }
  logout() {
    // Clear session or token
    this.storageService.clean();
    // Redirect to login
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    //return !!localStorage.getItem('jwtToken');
    return !!this.storageService.getUser()?.token;
  }

  setUser(data: any) {
    this.storageService.saveUser(data);
  }
  getUsername(): string | null {
    return this.storageService.getUser()?.username;
  }
  getUser(): string | null {
    //return localStorage.getItem('jwtToken');
    return this.storageService.getUser();
  }

  getToken(): string | null {
    //return localStorage.getItem('jwtToken');
    //return atob(this.storageService.getUser()?.token!);
    return this.storageService.getUser()?.token;
  }

  setToken(token: string, roles: string[]) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getRoles(): string[] {
    const user = this.storageService.getUser();
    return user && user.roles ? user.roles : [];
  }

  hasRole(role: string): boolean {
    //const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    //const roles = JSON.parse(this.storageService.getUser()?.roles || '[]');
    const user = this.storageService.getUser();
    const roles = user && user.roles ? user.roles : [];
    return roles.includes(role);
  }
  private handleError(error: HttpErrorResponse, message: string): Observable<never> {
    this.logger.logError(message || 'Something went wrong in service. Please try again.', error);
    // You can use a notification/snackbar service here
    console.error(message || 'Something went wrong in service. Please try again.', error);
    return throwError(() => new Error(message || 'Something went wrong in service. Please try again.' + error));
  }
}

