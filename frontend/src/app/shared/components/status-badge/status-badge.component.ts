import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatusPipe } from '../../pipes/application-status.pipe';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, ApplicationStatusPipe],
  template: `
    <span class="badge rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1" [ngClass]="badgeClass">
      <i class="bi" [ngClass]="iconClass"></i>
      {{ status | applicationStatus }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = 'DRAFT';

  get badgeClass(): string {
    const s = this.status ? this.status.toLowerCase() : 'draft';
    switch (s) {
      case 'draft': return 'badge-draft';
      case 'submitted': return 'badge-submitted';
      case 'under_review': return 'badge-under_review';
      case 'document_verification': return 'badge-document_verification';
      case 'approved':
      case 'verified': return 'badge-approved';
      case 'rejected': return 'badge-rejected';
      case 'disbursed': return 'badge-disbursed';
      default: return 'bg-secondary text-white';
    }
  }

  get iconClass(): string {
    const s = this.status ? this.status.toLowerCase() : 'draft';
    switch (s) {
      case 'draft': return 'bi-pencil-square';
      case 'submitted': return 'bi-send';
      case 'under_review': return 'bi-search';
      case 'document_verification': return 'bi-file-earmark-check';
      case 'approved':
      case 'verified': return 'bi-check-circle-fill';
      case 'rejected': return 'bi-x-circle-fill';
      case 'disbursed': return 'bi-cash-coin';
      default: return 'bi-info-circle';
    }
  }
}
