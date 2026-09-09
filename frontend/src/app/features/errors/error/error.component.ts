import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4 text-center">
      <div class="ff-card p-5 shadow-lg border-0" style="max-width: 500px;">
        <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style="width: 80px; height: 80px;">
          <i class="bi bi-exclamation-octagon-fill fs-1"></i>
        </div>
        <h3 class="fw-bold mb-2">Unexpected Application Error</h3>
        <p class="text-muted fs-7 mb-4">
          A backend microservice or system error occurred. We have logged the trace for our engineering team.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <button (click)="retry()" class="btn btn-outline-secondary py-2 px-4 fw-semibold">
            <i class="bi bi-arrow-clockwise me-1"></i> Try Again
          </button>
          <button (click)="goHome()" class="btn btn-ff-primary py-2 px-4 fw-bold">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  `
})
export class ErrorComponent {
  authService = inject(AuthService);
  router = inject(Router);

  retry(): void {
    window.location.reload();
  }

  goHome(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/applicant/dashboard']);
    }
  }
}
