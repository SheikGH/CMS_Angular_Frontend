// src/app/components/customer-form/customer-form.component.ts
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Customer } from '../../models/customer.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { Observable } from 'rxjs';
import { NotificationService } from 'app/core/services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggingService } from 'app/core/services/logging.service';

@Component({
  selector: 'app-customer-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent {
  customerForm!: FormGroup;
  isEdit = false;
  editId = 0;

  constructor(
    private fb: FormBuilder, private customerService: CustomerService,
    private logger: LoggingService, private notify: NotificationService,
    public dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer | null,
  ) { 
    // const data = this.route.snapshot.data['customer'];
    // if (data) {
    //   this.customer = data;
    //   this.isEdit = true;
    // }
  }

  ngOnInit() {
    this.customerForm = this.fb.group({
      customerId: [this.data?.customerId || 0],
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || '', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$'),  // Only digits, 10 to 15 digits
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      address: [this.data?.address || '', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordKey: ['', Validators.required]
    }, {
      validators: [this.passwordMatchValidator]
    });
    if (this.data) this.onEdit(this.data);
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('passwordKey')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
  onSubmit(): void {
    if (this.customerForm.invalid) return;

    const customer = this.customerForm.value as Customer;
    let request: Observable<any>; // 👈 Fix: unify the observable type

    if (customer.customerId) {
      request = this.customerService.updateCustomer(customer.customerId, customer);
      this.notify.success('Updated successfully!');
    } else {
      request = this.customerService.createCustomer(customer);
      this.notify.success('Saved successfully!');
    }
    let message = this.isEdit ? 'updated' : 'add';
    request.subscribe({
      next: () => {
        this.notify.success(`Customer ${message} successfully`);
        this.dialogRef.close(true)
      },
      error: (err) => {
        this.logError(`Failed to ${message} customer`, err);
      },
      complete: () => {
        console.log(`${message} customer request completed`);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onEdit(customer: Customer) {
    //this.customerForm.patchValue(customer);
    this.isEdit = true;
    this.editId = customer.customerId;

    // Hide and disable password fields
    this.customerForm.get('password')?.clearValidators();
    this.customerForm.get('password')?.setValue('');
    this.customerForm.get('password')?.disable();

    this.customerForm.get('passwordKey')?.clearValidators();
    this.customerForm.get('passwordKey')?.setValue('');
    this.customerForm.get('passwordKey')?.disable();

    this.customerForm.updateValueAndValidity();
  }

  resetForm() {
    this.customerForm.reset();
    this.isEdit = false;
    this.editId = 0;

    // Re-enable and re-add validators
    this.customerForm.get('password')?.enable();
    this.customerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);

    this.customerForm.get('passwordKey')?.enable();
    this.customerForm.get('passwordKey')?.setValidators([Validators.required]);

    this.customerForm.updateValueAndValidity();
  }
  private logError(message: string, error: any) {
    this.notify.error(message);
    this.logger.logError(message || 'Something went wrong in Component. Please try again.', error);
    console.error(message || 'Something went wrong in Component. Please try again.', error);
  }
}
