import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in">
      <div class="modal-dialog-custom ff-card p-0 shadow-lg border-0 overflow-hidden" style="width: 90%; max-width: 480px;">
        <!-- Header -->
        <div class="p-3 p-md-4 bg-primary text-white d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <div class="bg-white bg-opacity-20 rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
              <i class="bi bi-shield-lock-fill fs-5"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-white">Change Account Password</h5>
              <div class="text-white text-opacity-80 fs-8">Update security credentials</div>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" (click)="close.emit()"></button>
        </div>

        <!-- Body Form -->
        <div class="p-4 bg-white">
          <form [formGroup]="passForm" (ngSubmit)="onSubmit()">
            <!-- Current Password -->
            <div class="mb-3">
              <label class="form-label fs-7 fw-semibold text-muted">Current Password</label>
              <input 
                type="password" 
                class="form-control" 
                placeholder="Enter current password" 
                formControlName="currentPassword"
                [class.is-invalid]="f['currentPassword'].touched && f['currentPassword'].errors"
              />
              <div *ngIf="f['currentPassword'].touched && f['currentPassword'].errors" class="text-danger fs-8 mt-1">
                Current password is required.
              </div>
            </div>

            <!-- New Password -->
            <div class="mb-3">
              <label class="form-label fs-7 fw-semibold text-muted">New Password</label>
              <input 
                type="password" 
                class="form-control" 
                placeholder="Minimum 6 characters" 
                formControlName="newPassword"
                [class.is-invalid]="f['newPassword'].touched && f['newPassword'].errors"
              />
              <div *ngIf="f['newPassword'].touched && f['newPassword'].errors" class="text-danger fs-8 mt-1">
                <span *ngIf="f['newPassword'].errors['required']">New password is required.</span>
                <span *ngIf="f['newPassword'].errors['minlength']">Must be at least 6 characters.</span>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="mb-4">
              <label class="form-label fs-7 fw-semibold text-muted">Confirm New Password</label>
              <input 
                type="password" 
                class="form-control" 
                placeholder="Re-type new password" 
                formControlName="confirmPassword"
                [class.is-invalid]="f['confirmPassword'].touched && passForm.hasError('mismatch')"
              />
              <div *ngIf="f['confirmPassword'].touched && passForm.hasError('mismatch')" class="text-danger fs-8 mt-1">
                Passwords do not match.
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex justify-content-end gap-2 pt-3 border-top">
              <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" (click)="close.emit()">
                Cancel
              </button>
              <button type="submit" class="btn btn-ff-primary btn-sm rounded-pill px-4 fw-bold" [disabled]="submitting || passForm.invalid">
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-1"></span>
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop-custom {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      z-index: 1095;
    }
    .modal-dialog-custom {
      background: var(--ff-bg-surface);
      color: var(--ff-text-main);
      border-radius: 1rem;
    }
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);

  submitting: boolean = false;
  passForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  get f() { return this.passForm.controls; }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const p1 = control.get('newPassword')?.value;
    const p2 = control.get('confirmPassword')?.value;
    return p1 === p2 ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.passForm.invalid) {
      this.passForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.toastService.success('Your account password has been updated successfully.', 'Password Changed');
      this.close.emit();
    }, 600);
  }
}
