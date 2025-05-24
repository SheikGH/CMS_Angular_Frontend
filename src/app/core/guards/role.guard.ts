import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth';


export function RoleGuard(expectedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const hasRole = expectedRoles.some(role => auth.hasRole(role));
    if (!hasRole) {
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  };
}
// export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
//     const auth = inject(AuthService);
//     const router = inject(Router);
//     const requiredRoles = route.data['roles'] as string[];
//     const userRoles = auth.getRoles();
//     const hasRole = userRoles?.some(role => requiredRoles.includes(role));
//     if (!hasRole) {
//       router.navigate(['/unauthorized']);
//       return false;
//     }
//     return true;
//   };
  