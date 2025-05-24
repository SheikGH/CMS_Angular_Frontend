export interface User {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    username: string;
    token: string;
    roles: string[]; // e.g., ['Admin']
  }
  