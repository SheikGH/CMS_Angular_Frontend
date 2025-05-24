import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customer/pages/customer-list/customer-list.component';
import { CustomerFormComponent } from './features/customer/pages/customer-form/customer-form.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { CustomerComponent } from './features/customer/pages/customer/customer.component';
import { UnauthorizedComponent } from './features/auth/pages/unauthorized/unauthorized.component';

import { RoleGuard } from './core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomerResolver } from './core/resolvers/customer.resolver';
import { CustomerDetailComponent } from './features/customer/pages/customer-detail/customer-detail.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  // { path: '**', redirectTo: 'customer' },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'customer',
    loadChildren: () =>
      import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
    data: { preload: true } // ✅ This route will be preloaded
  },
];

