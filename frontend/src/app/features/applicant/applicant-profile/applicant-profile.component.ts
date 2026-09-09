import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-applicant-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in" style="max-width: 800px; margin: 0 auto;">
      <div class="mb-4">
        <h3 class="fw-extrabold mb-1">My Account Profile</h3>
        <p class="text-muted fs-7 mb-0">Manage your contact details, employment record, and security settings</p>
      </div>

      <!-- Profile Header Avatar Banner -->
      <div class="ff-card p-4 mb-4 d-flex align-items-center gap-4">
        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold display-5 shadow" style="width: 80px; height: 80px;">
          {{ getUserInitials(currentUser?.name) }}
        </div>
        <div>
          <h4 class="fw-bold mb-1">{{ currentUser?.name }}</h4>
          <p class="text-muted fs-7 mb-1"><i class="bi bi-envelope me-1"></i> {{ currentUser?.email }}</p>
          <span class="badge bg-success bg-opacity-10 text-success px-3 py-1 fw-bold">{{ currentUser?.role }}</span>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <div class="ff-card p-4 p-md-5">
        <h5 class="fw-bold mb-4 text-primary"><i class="bi bi-person-lines-fill me-2"></i>Personal & Contact Details</h5>

        <form [formGroup]="profileForm" (ngSubmit)="onSave()">
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label fw-semibold fs-7 text-muted">Full Legal Name</label>
              <input type="text" class="form-control" formControlName="name" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold fs-7 text-muted">Email Address (Read only)</label>
              <input type="email" class="form-control bg-light" formControlName="email" readonly />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold fs-7 text-muted">Phone Number</label>
              <input type="tel" class="form-control" formControlName="phone" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold fs-7 text-muted">Pincode</label>
              <input type="text" class="form-control" formControlName="pincode" />
            </div>

            <div class="col-12">
              <label class="form-label fw-semibold fs-7 text-muted">Current Address</label>
              <textarea class="form-control" rows="2" formControlName="address"></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold fs-7 text-muted">City</label>
              <input type="text" class="form-control" formControlName="city" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold fs-7 text-muted">State</label>
              <input type="text" class="form-control" formControlName="state" />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-3 pt-3 border-top">
            <button type="submit" class="btn btn-ff-primary px-4 fw-bold" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-1"></span>
              <span>{{ saving ? 'Saving Changes...' : 'Save Profile Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
  `]
})
export class ApplicantProfileComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);

  currentUser = this.authService.currentUserValue;
  profileForm!: FormGroup;
  saving: boolean = false;

  ngOnInit(): void {
    const user = this.currentUser;
    this.profileForm = this.fb.group({
      name: [user?.name || '', Validators.required],
      email: [user?.email || ''],
      phone: [user?.phone || '9876543210', Validators.required],
      address: [user?.address || 'Flat 402, Apex Heights, Andheri West'],
      city: [user?.city || 'Mumbai'],
      state: [user?.state || 'Maharashtra'],
      pincode: [user?.pincode || '400001']
    });
  }

  getUserInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  onSave(): void {
    if (this.profileForm.invalid) return;

    this.saving = true;
    const val = this.profileForm.value;

    this.authService.updateProfile(val).subscribe({
      next: (updated) => {
        this.saving = false;
        this.currentUser = updated;
        this.toastService.success('Profile updated successfully and saved permanently.');
      },
      error: () => {
        this.saving = false;
        this.toastService.error('Failed to update profile.');
      }
    });
  }
}
