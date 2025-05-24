import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Customer, CustomerService } from '@customer';
import { AuthService } from '../../services/auth.service';
import { Register } from '../../models/register.model';
import { LoggingService } from 'app/core/services/logging.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  customerForm!: FormGroup;
  constructor(private fb: FormBuilder, private service: AuthService, private router: Router,
    private logger: LoggingService, private notify: NotificationService) { }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.customerForm = this.fb.group({
      customerId: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10,15}$'),  // Only digits, 10 to 15 digits
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const register = this.customerForm.value as Register;
    this.service.register(register).subscribe({
      next: () => {
        this.notify.success(`Customer register successfully`);
        this.resetForm();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.logError(`Failed to register customer`, err);
      },
      complete: () => {
        console.log(`Register customer request completed`);
      }
    });
  }

  resetForm() {
    this.customerForm.reset();
  }
  private logError(message: string, error: any) {
    this.notify.error(message);
    this.logger.logError(message || 'Something went wrong in Component. Please try again.', error);
    console.error(message || 'Something went wrong in Component. Please try again.', error);
  }
}
