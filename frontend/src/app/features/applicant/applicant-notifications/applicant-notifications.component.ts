import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-applicant-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in" style="max-width: 850px; margin: 0 auto;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">Notification Center</h3>
          <p class="text-muted fs-7 mb-0">System updates, loan decisions, and document remarks</p>
        </div>
        <button class="btn btn-outline-primary btn-sm fw-semibold" (click)="notificationService.markAllAsRead()">
          <i class="bi bi-check-all me-1"></i> Mark All as Read
        </button>
      </div>

      <div class="ff-card p-4">
        <div *ngIf="notificationService.notificationsSignal().length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-bell-slash fs-1 d-block mb-2"></i>
          <h6>No Notifications</h6>
          <p class="fs-8 mb-0">You have no unread updates at this moment.</p>
        </div>

        <div class="list-group list-group-flush">
          <div 
            *ngFor="let notif of notificationService.notificationsSignal()" 
            class="list-group-item p-3 border-bottom transition-all rounded-3 mb-2"
            [class.bg-light]="!notif.read"
            [class.border-start]="!notif.read"
            [class.border-primary]="!notif.read"
            [class.border-3]="!notif.read"
          >
            <div class="d-flex justify-content-between align-items-start mb-1">
              <div class="d-flex align-items-center gap-2">
                <i class="bi fs-5" [ngClass]="{
                  'bi-info-circle-fill text-info': notif.type === 'info',
                  'bi-check-circle-fill text-success': notif.type === 'success',
                  'bi-exclamation-triangle-fill text-warning': notif.type === 'warning',
                  'bi-x-circle-fill text-danger': notif.type === 'danger'
                }"></i>
                <h6 class="fw-bold mb-0 text-dark">{{ notif.title }}</h6>
                <span *ngIf="!notif.read" class="badge bg-primary fs-8">NEW</span>
              </div>
              <span class="text-muted fs-8">{{ notif.timestamp }}</span>
            </div>

            <p class="text-muted fs-7 mb-2 ms-4">{{ notif.message }}</p>
            
            <div class="d-flex justify-content-end gap-2 ms-4">
              <button *ngIf="!notif.read" class="btn btn-link btn-xs text-secondary p-0 text-decoration-none" (click)="notificationService.markAsRead(notif.id)">
                Mark Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class ApplicantNotificationsComponent {
  notificationService = inject(NotificationService);
}
