// src/app/features/customer/customer.routes.ts
import { Routes } from '@angular/router';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { AuthGuard, RoleGuard } from '@core';
import { CustomerResolver } from 'app/core/resolvers/customer.resolver';
// import { CustomerListComponent } from './pages/customer-list/customer-list.component';
// import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerDetailComponent } from './pages/customer-detail/customer-detail.component';

export const CUSTOMER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/customer-list/customer-list.component').then(m => m.CustomerListComponent),
        canActivate: [AuthGuard, RoleGuard(['Employee', 'Admin'])],
        //data: { roles: ['Admin', 'Manager'] },
        //resolve: { customer: CustomerResolver }
    },
    {
        path: 'list',
        loadComponent: () => import('./pages/customer/customer.component').then(m => m.CustomerComponent),
        canActivate: [AuthGuard, RoleGuard(['Employee', 'Admin'])],
    },
    { path: 'add', component: CustomerFormComponent },
    { path: 'edit/:id', component: CustomerFormComponent, resolve: { customer: CustomerResolver } },
    {
        path: 'detail/:id',
        loadComponent: () => import('./pages/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent),
        canActivate: [AuthGuard, RoleGuard(['Employee', 'Admin'])],
        resolve: { customer: CustomerResolver }
    }
];
