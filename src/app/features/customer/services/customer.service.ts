import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Customer } from '../models/customer.model';
import { Observable, catchError, throwError } from 'rxjs';
import { ConfigService } from 'app/core/services/config.service';
import { NotificationService } from 'app/core/services/notification.service';
import { LoggingService } from 'app/core/services/logging.service';
import { error } from 'console';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl; // Change to your actual API

  constructor(private http: HttpClient, private configService: ConfigService,
    private logger: LoggingService) {
    this.apiUrl = `${this.configService.apiBaseUrl}/customers`;
  }

  // getCustomers(): Observable<Customer[]> {
  //   return this.http.get<Customer[]>(this.apiUrl);
  // }
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      catchError(err => this.handleError(err, 'Could not fetch customers'))
      //catchError(err => { this.logger.logError(err); return throwError(() => err); })
    );
  }
  // getCustomers(): Observable<Customer[]> {
  //   return this.http.get<any[]>(this.apiUrl).pipe(
  //     map(data =>
  //       data.map(item => ({
  //         firstName: item.first_name,
  //         lastName: item.last_name,

  //       }))
  //     )
  //   );
  // }


  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.handleError(err, 'Could not fetch customer'))
    );
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer, httpOptions).pipe(
      catchError(err => this.handleError(err, 'Could not fetch customer'))
    );
  }

  updateCustomer(id: number, customer: Customer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, customer, httpOptions).pipe(
      catchError(err => this.handleError(err, 'Could not update customer'))
    );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.handleError(err, 'Could not delete customer'))
    );
  }

  private handleError(error: HttpErrorResponse, message: string): Observable<never> {
    this.logger.logError(message || 'Something went wrong in service. Please try again.', error);
    // You can use a notification/snackbar service here
    console.error(message || 'Something went wrong in service. Please try again.', error);
    return throwError(() => new Error(message || 'Something went wrong in service. Please try again.' + error));
  }
}
