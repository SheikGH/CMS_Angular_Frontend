import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../models/user.model';
import { LoggingService } from 'app/core/services/logging.service';
import { NotificationService } from 'app/core/services/notification.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoginFailed = false;
  errorMessage = '';

  isLoggedIn = false;
  roles: string[] = [];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
    private logger: LoggingService, private notify: NotificationService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
      this.roles = this.authService.getRoles();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      //const { username, password } = this.loginForm.value;
      //this.authService.login(username, password).subscribe({

      const user = this.loginForm.value as User;
      this.authService.login(user).subscribe({
        next: data => {
          this.authService.setUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.authService.getRoles();
          // Redirect to /customer after successful login
          this.router.navigate(['/customer']);
          this.notify.success('Login successfully!');
        },
        error: err => {
          this.isLoginFailed = true;
          this.errorMessage = 'Invalid username or password'; //err.error.message;
          this.logError(`Failed to login customer`, err);
        },
        complete: () => {
          console.log(`Login customer request completed`);
        }
      });
    }
  }
  private logError(message: string, error: any) {
    this.notify.error(message);
    this.logger.logError(message || 'Something went wrong in Component. Please try again.', error);
    console.error(message || 'Something went wrong in Component. Please try again.', error);
  }
}
