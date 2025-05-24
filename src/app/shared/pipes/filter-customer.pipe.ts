import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from 'app/features/customer/models/customer.model';

@Pipe({
    name: 'filterCustomers',
    pure: true,
  })
  export class FilterCustomersPipe implements PipeTransform {
    transform(customers: Customer[], searchTerm: string): Customer[] {
      return customers.filter(c => c.firstName.includes(searchTerm));
    }
  }
  