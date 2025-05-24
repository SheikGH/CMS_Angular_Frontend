import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { LoggingService } from 'app/core/services/logging.service';
import { NotificationService } from 'app/core/services/notification.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-customer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit, AfterViewInit {
  customerForm!: FormGroup;
  // customers: Customer[] = [];
  displayedColumns: string[] = ['index','firstName', 'lastName', 'email', 'phone', 'address', 'actions'];
  dataSource = new MatTableDataSource<Customer>();
  isEdit = false;
  editId = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private service: CustomerService, @Inject(PLATFORM_ID) private platformId: Object,
    private logger: LoggingService, private notify: NotificationService) { }
  route = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.initForm();
    if (isPlatformBrowser(this.platformId)) {
      this.loadCustomers(); // only run in browser
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  loadCustomers() {
    this.service.getCustomers()
      .subscribe({
        next: (customers: Customer[]) => {
          this.dataSource.data = customers;
          this.loading = false;
          this.notify.success('Customers loaded successfully');
        },
        error: (err) => {
          this.logError('Failed to load customers', err);
        },
        complete: () => {
          console.log('Load customers request completed');
        }
      });

  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const customer = this.customerForm.value as Customer;

    if (this.isEdit) {
      this.service.updateCustomer(this.editId, customer).subscribe({
        next: () => {
          this.notify.success('Customer updated successfully');
          this.loadCustomers();
          this.resetForm();
        },
        error: (err) => {
          this.logError('Failed to update customer', err);
        },
        complete: () => {
          console.log('Update customer request completed');
        }
      });
    } else {
      this.service.createCustomer(customer).subscribe({
        next: (newCustomer: Customer) => {
          this.notify.success('Customer added successfully');
          this.loadCustomers();
          this.resetForm();
        },
        error: (err) => {
          this.logError('Failed to add customer', err);
        },
        complete: () => {
          console.log('Add customer request completed');
        }
      });
    }
  }

  onEdit(customer: Customer) {
    this.customerForm.patchValue(customer);
    this.isEdit = true;
    this.editId = customer.customerId;

    // Hide and disable password fields
    this.customerForm.get('password')?.clearValidators();
    this.customerForm.get('password')?.setValue('');
    this.customerForm.get('password')?.disable();

    this.customerForm.get('confirmPassword')?.clearValidators();
    this.customerForm.get('confirmPassword')?.setValue('');
    this.customerForm.get('confirmPassword')?.disable();

    this.customerForm.updateValueAndValidity();
  }

  onDelete(id: number) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    this.service.deleteCustomer(id).subscribe({
      next: () => {
        this.notify.success('Customer deleted successfully');
        this.loadCustomers();
      },
      error: (err) => {
        this.logError('Failed to delete customer', err);
      },
      complete: () => {
        console.log('Delete customer request completed');
      }
    });
  }

  resetForm() {
    this.customerForm.reset();
    this.isEdit = false;
    this.editId = 0;

    // Re-enable and re-add validators
    this.customerForm.get('password')?.enable();
    this.customerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);

    this.customerForm.get('confirmPassword')?.enable();
    this.customerForm.get('confirmPassword')?.setValidators([Validators.required]);

    this.customerForm.updateValueAndValidity();
  }
  private logError(message: string, error: any) {
    this.notify.error(message);
    this.logger.logError(message || 'Something went wrong in Component. Please try again.', error);
    console.error(message || 'Something went wrong in Component. Please try again.', error);
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
