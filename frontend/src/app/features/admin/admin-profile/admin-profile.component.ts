import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in" style="max-width: 800px; margin: 0 auto;">
      <div class="mb-4">
        <h3 class="fw-extrabold mb-1">Underwriter Profile</h3>
        <p class="text-muted fs-7 mb-0">System administrative credentials and security identity</p>
      </div>

      <div class="ff-card p-4 d-flex align-items-center gap-4 mb-4">
        <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold display-5 shadow" style="width: 80px; height: 80px;">
          SU
        </div>
        <div>
          <h4 class="fw-bold mb-1">{{ currentUser?.name }}</h4>
          <p class="text-muted fs-7 mb-1">{{ currentUser?.email }}</p>
          <span class="badge bg-primary px-3 py-1">ADMINISTRATOR / UNDERWRITER</span>
        </div>
      </div>

      <div class="ff-card p-4 p-md-5">
        <h5 class="fw-bold mb-3 text-primary">System Access Rights</h5>
        <ul class="list-group list-group-flush fs-7">
          <li class="list-group-item d-flex justify-content-between">
            <span>Loan Decision Override</span>
            <i class="bi bi-check-circle-fill text-success"></i>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>KYC Document Verification & Rejection</span>
            <i class="bi bi-check-circle-fill text-success"></i>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>User Account Activation / Deactivation</span>
            <i class="bi bi-check-circle-fill text-success"></i>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Audit Trail & RabbitMQ Stream Inspection</span>
            <i class="bi bi-check-circle-fill text-success"></i>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class AdminProfileComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUserValue;
}
