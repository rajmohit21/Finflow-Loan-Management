import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090;">
      <div 
        *ngFor="let toast of toastService.toasts$ | async" 
        class="toast show shadow-lg mb-2 border-0" 
        [ngClass]="'bg-' + toast.type + ' text-white'"
        role="alert"
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div class="toast-header bg-transparent text-white border-0">
          <i class="bi me-2" [ngClass]="{
            'bi-check-circle-fill': toast.type === 'success',
            'bi-exclamation-triangle-fill': toast.type === 'danger' || toast.type === 'warning',
            'bi-info-circle-fill': toast.type === 'info'
          }"></i>
          <strong class="me-auto">{{ toast.title || 'Notification' }}</strong>
          <button type="button" class="btn-close btn-close-white" (click)="toastService.remove(toast.id)"></button>
        </div>
        <div class="toast-body pt-0">
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast {
      border-radius: 0.5rem;
      min-width: 300px;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
