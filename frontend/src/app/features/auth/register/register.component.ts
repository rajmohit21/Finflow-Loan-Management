import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
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
        <div class="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2">
          <i class="bi bi-person-plus-fill fs-2"></i>
        </div>
        <h3 class="fw-extrabold mb-1">Create an Account</h3>
        <p class="text-muted fs-7">Register to apply for loans & track approvals</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <!-- Full Name -->
        <div class="mb-3">
          <label class="form-label fw-semibold fs-7 text-muted">Full Legal Name</label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-person text-muted"></i></span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="e.g. Rahul Sharma" 
              formControlName="name"
              [class.is-invalid]="f['name'].touched && f['name'].errors"
            />
          </div>
          <div *ngIf="f['name'].touched && f['name'].errors" class="text-danger fs-8 mt-1">
            <span *ngIf="f['name'].errors['required']">Full name is required.</span>
          </div>
        </div>

        <!-- Email & Phone Grid -->
        <div class="row g-3 mb-3">
          <div class="col-sm-6">
            <label class="form-label fw-semibold fs-7 text-muted">Email Address</label>
            <input 
              type="email" 
              class="form-control" 
              placeholder="name@example.com" 
              formControlName="email"
              [class.is-invalid]="f['email'].touched && f['email'].errors"
            />
            <div *ngIf="f['email'].touched && f['email'].errors" class="text-danger fs-8 mt-1">
              <span *ngIf="f['email'].errors['required']">Email required.</span>
              <span *ngIf="f['email'].errors['email']">Invalid email.</span>
            </div>
          </div>

          <div class="col-sm-6">
            <label class="form-label fw-semibold fs-7 text-muted">Phone Number</label>
            <input 
              type="tel" 
              class="form-control" 
              placeholder="10-digit mobile" 
              formControlName="phone"
              [class.is-invalid]="f['phone'].touched && f['phone'].errors"
            />
            <div *ngIf="f['phone'].touched && f['phone'].errors" class="text-danger fs-8 mt-1">
              <span *ngIf="f['phone'].errors['required']">Phone required.</span>
              <span *ngIf="f['phone'].errors['pattern']">Must be 10 digits.</span>
            </div>
          </div>
        </div>

        <!-- Role Select -->
        <div class="mb-3">
          <label class="form-label fw-semibold fs-7 text-muted">Account Type / Role</label>
          <select class="form-select" formControlName="role">
            <option value="APPLICANT">Loan Applicant (Standard User)</option>
            <option value="ADMIN">Admin Underwriter / Administrator</option>
          </select>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
          <label class="form-label fw-semibold fs-7 text-muted">Password</label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-lock text-muted"></i></span>
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              class="form-control" 
              placeholder="Min 6 chars with letters & numbers" 
              formControlName="password"
              (input)="updatePasswordStrength()"
              [class.is-invalid]="f['password'].touched && f['password'].errors"
            />
            <button class="btn btn-outline-secondary" type="button" (click)="showPassword = !showPassword">
              <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
            </button>
          </div>
          
          <!-- Password Strength Indicator Bar -->
          <div *ngIf="f['password'].value" class="mt-2">
            <div class="progress" style="height: 6px;">
              <div class="progress-bar" [ngClass]="strengthBarClass" [style.width.%]="strengthScore"></div>
            </div>
            <div class="d-flex justify-content-between fs-8 mt-1" [ngClass]="strengthTextClass">
              <span>Strength: <strong>{{ strengthLabel }}</strong></span>
            </div>
          </div>

          <div *ngIf="f['password'].touched && f['password'].errors" class="text-danger fs-8 mt-1">
            <span *ngIf="f['password'].errors['required']">Password is required.</span>
            <span *ngIf="f['password'].errors['minlength']">Must be at least 6 characters.</span>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="mb-3">
          <label class="form-label fw-semibold fs-7 text-muted">Confirm Password</label>
          <input 
            type="password" 
            class="form-control" 
            placeholder="Re-enter password" 
            formControlName="confirmPassword"
            [class.is-invalid]="f['confirmPassword'].touched && registerForm.hasError('passwordMismatch')"
          />
          <div *ngIf="f['confirmPassword'].touched && registerForm.hasError('passwordMismatch')" class="text-danger fs-8 mt-1">
            Passwords do not match.
          </div>
        </div>

        <!-- Terms and Conditions Checkbox -->
        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" id="terms" formControlName="terms" [class.is-invalid]="f['terms'].touched && f['terms'].errors">
          <label class="form-check-label fs-8 text-muted" for="terms">
            I agree to the <a href="javascript:void(0)" class="text-primary">Terms of Service</a> and <a href="javascript:void(0)" class="text-primary">Privacy Policy</a>
          </label>
          <div *ngIf="f['terms'].touched && f['terms'].errors" class="text-danger fs-8 mt-1">
            You must accept the terms.
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="btn btn-ff-primary w-100 py-2.5 fs-6 fw-bold"
          [disabled]="loading || registerForm.invalid"
        >
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span>{{ loading ? 'Creating Account...' : 'Complete Registration' }}</span>
        </button>

        <div class="text-center mt-4 pt-3 border-top fs-7 text-muted">
          Already have an account? 
          <a routerLink="/login" class="fw-bold text-primary text-decoration-none">Sign In Here</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  router = inject(Router);

  registerForm!: FormGroup;
  loading: boolean = false;
  showPassword: boolean = false;

  strengthScore: number = 0;
  strengthLabel: string = 'Weak';
  strengthBarClass: string = 'bg-danger';
  strengthTextClass: string = 'text-danger';

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['APPLICANT' as UserRole, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  updatePasswordStrength(): void {
    const val = this.f['password'].value || '';
    if (!val) {
      this.strengthScore = 0;
      this.strengthLabel = 'Weak';
      return;
    }

    let score = 0;
    if (val.length >= 6) score += 30;
    if (val.length >= 10) score += 20;
    if (/[A-Z]/.test(val)) score += 25;
    if (/[0-9]/.test(val)) score += 25;

    this.strengthScore = Math.min(score, 100);

    if (score < 40) {
      this.strengthLabel = 'Weak';
      this.strengthBarClass = 'bg-danger';
      this.strengthTextClass = 'text-danger';
    } else if (score < 75) {
      this.strengthLabel = 'Medium';
      this.strengthBarClass = 'bg-warning';
      this.strengthTextClass = 'text-warning';
    } else {
      this.strengthLabel = 'Strong';
      this.strengthBarClass = 'bg-success';
      this.strengthTextClass = 'text-success';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const val = this.registerForm.value;

    this.authService.signup({
      fullName: val.name,
      name: val.name,
      email: val.email,
      phone: val.phone,
      role: val.role,
      password: val.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Registration successful! Please sign in with your credentials.', 'Account Created');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to create account. Email may already be in use.', 'Registration Error');
      }
    });
  }
}
