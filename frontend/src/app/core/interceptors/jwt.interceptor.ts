import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const user = authService.currentUserValue;

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (user && user.id) {
    headers = headers.set('X-User-Id', user.id.toString());
    if (user.email) {
      headers = headers.set('X-User-Email', user.email);
    }
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};
