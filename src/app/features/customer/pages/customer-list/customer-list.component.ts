// src/app/components/customer-list/customer-list.component.ts
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from 'app/core/services/notification.service';
import { LoggingService } from 'app/core/services/logging.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'firstName', 'lastName', 'email', 'phone', 'address', 'actions'];
  dataSource = new MatTableDataSource<Customer>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private destroy$ = new Subject<void>();

  constructor(private customerService: CustomerService, @Inject(PLATFORM_ID) private platformId: Object, private notify: NotificationService,
    private logger: LoggingService, private dialog: MatDialog) { }
   
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCustomers(); // only run in browser
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
  // loadCustomers(): void {
  //   this.customerService.getCustomers().subscribe((customers) => {
  //     this.dataSource.data = customers;
  //     // this.dataSource.paginator = this.paginator;
  //     // this.dataSource.sort = this.sort;
  //     this.loading = false;
  //     this.notify.success('Customers loaded successfully');
  //   });
  // }
  loadCustomers(): void {
    this.customerService.getCustomers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (customers: Customer[]) => {
        this.dataSource.data = customers;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
        this.notify.success('Customers loaded successfully');
      },
      error: (err) => {
        this.loading = false;
        this.logError('Failed to load customers', err);
        // console.error(err);
        // this.notify.error('Failed to load customers');
      },
      complete: () => {
        this.loading = false;
        console.log('Load customers request completed');
      }
    });
  }
  deleteCustomer(id: number): void {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    this.customerService.deleteCustomer(id).subscribe({
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // this.dataSource.filterPredicate = (data: Customer, filter: string) => {
  //   return Object.values(data).some(value =>
  //     value.toString().toLowerCase().includes(filter)
  //   );
  // };
  
  openDialog(customer?: Customer) {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '400px',
      data: customer ? { ...customer } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCustomers();
    });
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCustomers();
      //if (result) { this.customerService.createCustomer(result).subscribe(() => this.loadCustomers()); }
    });

  }

  openEditDialog(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '600px',
      data: customer ? { ...customer } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCustomers();
      //if (result) { this.customerService.updateCustomer(result.customerId, result).subscribe(() => this.loadCustomers()); }
    });

  }
  getGlobalIndex(indexOnPage: number): number {
    const currentPage = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    return currentPage * pageSize + indexOnPage + 1;
  }
  private logError(message: string, error: any) {
    // You can use a notification/snackbar service here
    this.notify.error(message);
    this.logger.logError(message || 'Something went wrong in Component. Please try again.', error);
    console.error(message || 'Something went wrong in Component. Please try again.', error);
  }
}
