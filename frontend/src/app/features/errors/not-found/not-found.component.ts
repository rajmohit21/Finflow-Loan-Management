import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4 text-center">
      <div class="ff-card p-5 shadow-lg border-0" style="max-width: 500px;">
        <div class="display-1 fw-extrabold text-primary mb-2">404</div>
        <i class="bi bi-file-earmark-break-fill text-muted fs-1 d-block mb-3"></i>
        <h3 class="fw-bold mb-2">Page Not Found</h3>
        <p class="text-muted fs-7 mb-4">
          The requested route or loan record does not exist or has been moved.
        </p>
        <button (click)="goHome()" class="btn btn-ff-primary py-2 px-4 fw-bold">
          <i class="bi bi-house-door-fill me-2"></i> Go to Dashboard
        </button>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  authService = inject(AuthService);
  router = inject(Router);

  goHome(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isLoggedIn()) {
      this.router.navigate(['/applicant/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
