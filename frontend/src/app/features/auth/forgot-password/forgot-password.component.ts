import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="ff-card p-4 p-md-5 animate-fade-in shadow-lg border-0">
      <div class="text-center mb-4">
        <div class="bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2">
          <i class="bi bi-key-fill fs-2"></i>
        </div>
        <h3 class="fw-extrabold mb-1">Reset Password</h3>
        <p class="text-muted fs-7">Enter your email address to receive password reset instructions</p>
      </div>

      <div *ngIf="submitted" class="alert alert-success border-0 shadow-sm p-4 text-center">
        <i class="bi bi-envelope-check-fill fs-1 text-success d-block mb-2"></i>
        <h5 class="fw-bold text-success">Reset Link Dispatched!</h5>
        <p class="fs-7 text-muted mb-0">We have sent password reset instructions to <strong>{{ email }}</strong>. Please check your inbox.</p>
      </div>

      <form *ngIf="!submitted" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="form-label fw-semibold fs-7 text-muted">Registered Email</label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-envelope text-muted"></i></span>
            <input 
              type="email" 
              class="form-control" 
              placeholder="name@example.com" 
              [(ngModel)]="email" 
              name="email"
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-ff-primary w-100 py-2.5 fs-6 fw-bold"
          [disabled]="loading || !email"
        >
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span>{{ loading ? 'Sending instructions...' : 'Send Reset Instructions' }}</span>
        </button>

        <div class="text-center mt-4 pt-3 border-top fs-7 text-muted">
          Remembered your password? 
          <a routerLink="/login" class="fw-bold text-primary text-decoration-none">Back to Sign In</a>
        </div>
      </form>
    </div>
  `
})
export class ForgotPasswordComponent {
  toastService = inject(ToastService);
  email: string = '';
  loading: boolean = false;
  submitted: boolean = false;

  onSubmit(): void {
    if (!this.email) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
      this.toastService.success('Reset email sent successfully.');
    }, 1200);
  }
}
