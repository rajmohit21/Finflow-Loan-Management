import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in" style="max-width: 850px; margin: 0 auto;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">Admin Notification Feed</h3>
          <p class="text-muted fs-7 mb-0">System notifications and underwriter activity alerts</p>
        </div>
        <button class="btn btn-outline-primary btn-sm fw-semibold" (click)="notificationService.markAllAsRead()">
          Mark All as Read
        </button>
      </div>

      <div class="ff-card p-4">
        <div *ngFor="let notif of notificationService.notificationsSignal()" class="p-3 bg-light rounded-3 mb-2 border-bottom">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h6 class="fw-bold mb-0 text-dark">{{ notif.title }}</h6>
            <span class="text-muted fs-8">{{ notif.timestamp }}</span>
          </div>
          <p class="text-muted fs-7 mb-0">{{ notif.message }}</p>
        </div>
      </div>
    </div>
  `
})
export class AdminNotificationsComponent {
  notificationService = inject(NotificationService);
}
