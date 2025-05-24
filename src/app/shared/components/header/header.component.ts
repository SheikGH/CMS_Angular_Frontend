import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, 
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  username: string | null = '';
  
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Get the username from localStorage or AuthService
    //this.username = localStorage.getItem('username') || 'Guest';
    this.username = this.authService.getUsername();
  }

  logout() {
    this.authService.logout();
  }
  
}