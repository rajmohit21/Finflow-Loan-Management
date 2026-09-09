import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineStep {
  key: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-3">
      <div class="d-none d-md-flex align-items-center justify-content-between position-relative px-4">
        <!-- Connecting Bar -->
        <div class="position-absolute start-0 end-0 top-50 translate-middle-y bg-secondary bg-opacity-25" style="height: 3px; z-index: 1;"></div>
        
        <div *ngFor="let step of steps; let i = index" class="position-relative text-center" style="z-index: 2;">
          <div 
            class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold text-white shadow-sm transition-all"
            [ngClass]="getStepClass(step.key)"
            style="width: 48px; height: 48px; font-size: 1.2rem;"
          >
            <i class="bi" [ngClass]="step.icon"></i>
          </div>
          <div class="fw-bold fs-7" [class.text-primary]="isCurrent(step.key)">{{ step.title }}</div>
          <div class="text-muted fs-8">{{ step.description }}</div>
        </div>
      </div>

      <!-- Mobile Vertical Stepper -->
      <div class="d-md-none position-relative ps-4 border-start border-2 ms-2">
        <div *ngFor="let step of steps" class="mb-4 position-relative ps-3">
          <div 
            class="position-absolute start-0 top-0 translate-middle rounded-circle d-flex align-items-center justify-content-center text-white"
            [ngClass]="getStepClass(step.key)"
            style="width: 28px; height: 28px; font-size: 0.85rem;"
          >
            <i class="bi" [ngClass]="step.icon"></i>
          </div>
          <div class="fw-bold" [class.text-primary]="isCurrent(step.key)">{{ step.title }}</div>
          <div class="text-muted fs-7">{{ step.description }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
    .transition-all { transition: all 0.3s ease; }
  `]
})
export class TimelineComponent {
  @Input() currentStatus: string = 'SUBMITTED';

  steps: TimelineStep[] = [
    { key: 'SUBMITTED', title: 'Submitted', description: 'Application Created', icon: 'bi-send-check' },
    { key: 'DOCUMENT_VERIFICATION', title: 'Doc Verification', description: 'Files Audit', icon: 'bi-file-earmark-medical' },
    { key: 'UNDER_REVIEW', title: 'Under Review', description: 'Credit Evaluation', icon: 'bi-shield-check' },
    { key: 'APPROVED', title: 'Decision', description: 'Approved / Rejected', icon: 'bi-patch-check' },
    { key: 'DISBURSED', title: 'Disbursed', description: 'Funds Transferred', icon: 'bi-bank' }
  ];

  private statusOrderMap: { [key: string]: number } = {
    'DRAFT': 0,
    'SUBMITTED': 1,
    'DOCUMENT_VERIFICATION': 2,
    'UNDER_REVIEW': 3,
    'APPROVED': 4,
    'REJECTED': 4,
    'DISBURSED': 5
  };

  getStepClass(stepKey: string): string {
    const currentOrder = this.statusOrderMap[this.currentStatus] || 1;
    const stepOrder = this.statusOrderMap[stepKey] || 1;

    if (this.currentStatus === 'REJECTED' && stepKey === 'APPROVED') {
      return 'bg-danger';
    }

    if (currentOrder > stepOrder) {
      return 'bg-success';
    } else if (currentOrder === stepOrder) {
      return 'bg-primary';
    } else {
      return 'bg-secondary bg-opacity-50';
    }
  }

  isCurrent(stepKey: string): boolean {
    return this.currentStatus === stepKey || (this.currentStatus === 'REJECTED' && stepKey === 'APPROVED');
  }
}
