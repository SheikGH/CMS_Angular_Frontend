import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { Customer, CustomerService } from '@customer';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<Customer> {
  constructor(private customerService: CustomerService) {}

  resolveGetCustomers(route: ActivatedRouteSnapshot): Observable<Customer[]> {
    return this.customerService.getCustomers();
  }
  resolve(route: ActivatedRouteSnapshot): Observable<Customer> {
    const id = route.paramMap.get('id')!;
    return this.customerService.getCustomerById(parseInt(id));
  }
}
