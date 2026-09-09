import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="ff-card p-4 p-md-5 animate-fade-in shadow-lg border-0 position-relative">
      <!-- Top Right Theme Switcher Toggle -->
      <div class="position-absolute top-0 end-0 p-3">
        <button 
          type="button"
          class="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" 
          style="width: 36px; height: 36px;"
          (click)="themeService.toggleTheme()"
          [title]="'Switch to ' + (themeService.currentTheme() === 'light' ? 'Dark' : 'Light') + ' Mode'"
        >
          <i class="bi" [ngClass]="themeService.currentTheme() === 'light' ? 'bi-moon-stars' : 'bi-sun-fill text-warning'"></i>
        </button>
      </div>

      <div class="text-center mb-4">
        <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2">
          <i class="bi bi-shield-lock-fill fs-2"></i>
        </div>
        <h3 class="fw-extrabold mb-1">FinFlow Identity Portal</h3>
        <p class="text-muted fs-7">Select your access portal to proceed</p>
      </div>

      <!-- Separate Role Selection Navigation Tabs -->
      <ul class="nav nav-pills nav-fill mb-4 p-1 bg-light rounded-3 border">
        <li class="nav-item">
          <button 
            type="button" 
            class="nav-link fw-bold fs-7 py-2 rounded-2 transition-all"
            [class.active]="activeRole === 'APPLICANT'"
            (click)="selectRole('APPLICANT')"
          >
            <i class="bi bi-person-fill me-1"></i> Loan Applicant Portal
          </button>
        </li>
        <li class="nav-item">
          <button 
            type="button" 
            class="nav-link fw-bold fs-7 py-2 rounded-2 transition-all"
            [class.active]="activeRole === 'ADMIN'"
            (click)="selectRole('ADMIN')"
          >
            <i class="bi bi-shield-check me-1"></i> Admin / Underwriter
          </button>
        </li>
      </ul>

      <!-- Quick Demo Login Bar -->
      <div class="p-3 bg-light rounded-3 mb-4 border text-center">
        <span class="fs-8 fw-bold text-muted text-uppercase d-block mb-2">⚡ Quick Pre-configured Login</span>
        <div class="d-flex flex-wrap gap-2 justify-content-center">
          <button 
            *ngIf="activeRole === 'APPLICANT'"
            type="button" 
            class="btn btn-outline-primary btn-sm fw-semibold"
            (click)="fillDemo('rahul.sharma@example.com', 'password123')"
          >
            <i class="bi bi-person-badge"></i> Demo Applicant (Rahul)
          </button>
          <button 
            *ngIf="activeRole === 'ADMIN'"
            type="button" 
            class="btn btn-outline-dark btn-sm fw-semibold"
            (click)="fillDemo('admin@finflow.com', 'password123')"
          >
            <i class="bi bi-shield-lock"></i> Demo Admin (Underwriter)
          </button>
        </div>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- Email Field -->
        <div class="mb-3">
          <label class="form-label fw-semibold fs-7 text-muted">
            {{ activeRole === 'ADMIN' ? 'Admin Email Address' : 'Applicant Email Address' }}
          </label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-envelope text-muted"></i></span>
            <input 
              type="email" 
              class="form-control"
              [placeholder]="activeRole === 'ADMIN' ? 'admin@finflow.com' : 'name@example.com'" 
              formControlName="email"
              [class.is-invalid]="f['email'].touched && f['email'].errors"
            />
          </div>
          <div *ngIf="f['email'].touched && f['email'].errors" class="text-danger fs-8 mt-1">
            <span *ngIf="f['email'].errors['required']">Email is required.</span>
            <span *ngIf="f['email'].errors['email']">Please enter a valid email address.</span>
          </div>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label fw-semibold fs-7 text-muted mb-0">Password</label>
            <a routerLink="/forgot-password" class="text-primary fs-8 text-decoration-none">Forgot password?</a>
          </div>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-lock text-muted"></i></span>
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              class="form-control"
              placeholder="••••••••" 
              formControlName="password"
              [class.is-invalid]="f['password'].touched && f['password'].errors"
            />
            <button class="btn btn-outline-secondary" type="button" (click)="showPassword = !showPassword">
              <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
            </button>
          </div>
          <div *ngIf="f['password'].touched && f['password'].errors" class="text-danger fs-8 mt-1">
            <span *ngIf="f['password'].errors['required']">Password is required.</span>
          </div>
        </div>

        <!-- Remember Me Checkbox -->
        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" id="rememberMe" formControlName="rememberMe">
          <label class="form-check-label fs-8 text-muted" for="rememberMe">
            Remember me on this browser
          </label>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="btn w-100 py-2.5 fs-6 fw-bold"
          [ngClass]="activeRole === 'ADMIN' ? 'btn-dark' : 'btn-ff-primary'"
          [disabled]="loading || loginForm.invalid"
        >
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span>{{ loading ? 'Authenticating...' : (activeRole === 'ADMIN' ? 'Sign In as Admin' : 'Sign In as Applicant') }}</span>
        </button>

        <!-- Register Link -->
        <div class="text-center mt-4 pt-3 border-top fs-7 text-muted">
          Don't have an applicant account? 
          <a routerLink="/register" class="fw-bold text-primary text-decoration-none">Create an Account</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  loading: boolean = false;
  showPassword: boolean = false;
  returnUrl: string = '';
  activeRole: 'APPLICANT' | 'ADMIN' = 'APPLICANT';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [true]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  get f() { return this.loginForm.controls; }

  selectRole(role: 'APPLICANT' | 'ADMIN'): void {
    this.activeRole = role;
    if (role === 'ADMIN') {
      this.loginForm.patchValue({ email: 'admin@finflow.com', password: 'password123' });
    } else {
      this.loginForm.patchValue({ email: 'rahul.sharma@example.com', password: 'password123' });
    }
  }

  fillDemo(email: string, pass: string): void {
    this.loginForm.patchValue({
      email,
      password: pass
    });
    this.toastService.info(`Loaded demo credentials for ${email}`);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (token) => {
        this.loading = false;
        this.toastService.success('Authentication successful! Welcome to FinFlow.', 'Login Success');
        
        const target = this.returnUrl ? this.returnUrl : (this.authService.isAdmin() ? '/admin/dashboard' : '/applicant/dashboard');
        this.router.navigate([target]);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Invalid email or password. Please try again.', 'Authentication Failed');
      }
    });
  }
}
