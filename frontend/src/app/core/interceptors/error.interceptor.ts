import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      const isLoginReq = req.url.includes('/auth/login') || req.url.includes('/auth/signup');
      const token = authService.getToken();
      const isMockToken = token ? token.startsWith('mock_') : false;
      const isMockMode = environment.mockMode || isMockToken;

      if (error.status === 401 && !isLoginReq && !isMockMode) {
        toastService.error('Your session has expired. Please log in again.', 'Unauthorized');
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toastService.error('You do not have permission to access this resource.', 'Access Denied');
      } else if (error.status === 404 && !isMockMode) {
        toastService.warning('The requested resource was not found.', 'Not Found');
      } else if (error.status >= 500 && !isMockMode && !isLoginReq) {
        toastService.error('Backend service error encountered. Retrying or using fallback.', 'Server Error');
      } else if (error.status === 0) {
        console.warn('Backend API unavailable. Operating in development/mock fallback mode:', req.url);
      }

      return throwError(() => error);
    })
  );
};