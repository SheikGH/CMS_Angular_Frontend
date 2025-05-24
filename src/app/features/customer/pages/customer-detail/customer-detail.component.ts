import { Component } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule, 
    MatDividerModule
  ],
  // template: `
  //   <h2>Customer Detail</h2>
  //   <div *ngIf="customer">
  //     <p>Name: {{ customer?.firstName }}</p>
  //     <p>Email: {{ customer?.email }}</p>
  //   </div>
  // `,
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent {
  customer: Customer | null = null;

  constructor(private route: ActivatedRoute) {
    this.customer = this.route.snapshot.data['customer'];// comes from resolver
  }
}
