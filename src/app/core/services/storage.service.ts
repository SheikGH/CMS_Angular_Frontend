import { Injectable } from '@angular/core';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    // localStorage.removeItem('jwtToken');
    // localStorage.removeItem('roles');
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    //user.token = user.token? btoa(user.token) : user.token; // Secure Storage (Basic) => base64 encode (use real encryption in production)
    //console.log('saveUser::token:',user.token,btoa(user.token));
    
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('saveUser::sessionStorage:',window.sessionStorage.getItem(USER_KEY));
    // localStorage.setItem('jwtToken', token);
    // localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}