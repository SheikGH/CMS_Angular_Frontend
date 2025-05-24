import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Customer, CustomerService } from '@customer';

@Injectable({ providedIn: 'root' })
export class CustomerResolver implements Resolve<Customer | null> {
  constructor(private service: CustomerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Customer | null> {
    const id = route.paramMap.get('id');
    return id ? this.service.getCustomerById(+id) : of(null);
  }
}
