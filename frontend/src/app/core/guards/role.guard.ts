import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Traverse route hierarchy to find 'roles' data if child route lacks it
  let expectedRoles: UserRole[] = route.data['roles'];
  let curr: ActivatedRouteSnapshot | null = route.parent;
  while (!expectedRoles && curr) {
    expectedRoles = curr.data['roles'];
    curr = curr.parent;
  }
  expectedRoles = expectedRoles || [];

  const userRole = authService.getRole();

  if (authService.isLoggedIn() && userRole) {
    if (expectedRoles.length === 0) {
      return true;
    }

    const hasRole = expectedRoles.includes(userRole) || 
      (expectedRoles.includes('APPLICANT') && (userRole === 'USER' || userRole === 'APPLICANT'));

    if (hasRole) {
      return true;
    }
  }

  // Safe redirect using UrlTree to prevent circular routing freeze
  if (userRole === 'ADMIN') {
    if (!state.url.startsWith('/admin')) {
      return router.createUrlTree(['/admin/dashboard']);
    }
  } else if (userRole === 'APPLICANT' || userRole === 'USER') {
    if (!state.url.startsWith('/applicant')) {
      return router.createUrlTree(['/applicant/dashboard']);
    }
  }

  return router.createUrlTree(['/login']);
};

