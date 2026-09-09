import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-support-assistance-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in">
      <div class="modal-dialog-custom ff-card p-0 shadow-lg border-0 overflow-hidden" style="width: 92%; max-width: 750px; max-height: 92vh;">
        <!-- Modal Header -->
        <div class="p-3 p-md-4 bg-primary text-white d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-white bg-opacity-20 rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
              <i class="bi bi-headset fs-4"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-white">FinFlow Expert Loan Assistance</h5>
              <div class="text-white text-opacity-80 fs-8">Dedicated Financial Advisors & Loan Desk</div>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" (click)="close.emit()"></button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-4 overflow-y-auto" style="max-height: calc(92vh - 140px);">
          <!-- 24/7 Helpline Banner -->
          <div class="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-3 mb-4 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-telephone-inbound-fill fs-2 text-primary"></i>
              <div>
                <div class="text-uppercase text-muted fs-8 fw-bold">24/7 Toll-Free National Helpline</div>
                <div class="fs-5 fw-extrabold text-primary">1800-200-3463 (FINFLOW)</div>
              </div>
            </div>
            <a href="tel:18002003463" class="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-none d-sm-inline-block">
              <i class="bi bi-telephone-fill me-1"></i> Call Toll-Free
            </a>
          </div>

          <!-- Financial Experts Directory -->
          <h6 class="fw-bold text-dark mb-3 border-bottom pb-2">
            <i class="bi bi-people-fill text-primary me-1"></i> Dedicated Financial Relationship Managers
          </h6>

          <div class="row g-3 mb-4">
            <!-- Expert 1 -->
            <div class="col-md-6">
              <div class="p-3 border rounded-3 bg-white h-100 shadow-sm hover-shadow transition-all">
                <div class="d-flex align-items-center gap-3 mb-2">
                  <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 48px; height: 48px; font-size: 1.1rem;">
                    RS
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0 text-dark">Rajesh Sharma</h6>
                    <div class="badge bg-success bg-opacity-10 text-success fs-8">Senior Relationship Manager</div>
                    <div class="text-muted fs-8">Home & Personal Loans</div>
                  </div>
                </div>
                <hr class="my-2">
                <div class="fs-8 text-muted">
                  <div class="mb-1"><i class="bi bi-telephone-fill text-primary me-2"></i> +91 98200 45112</div>
                  <div class="mb-1"><i class="bi bi-envelope-fill text-primary me-2"></i> r.sharma&#64;finflowbank.com</div>
                  <div><i class="bi bi-clock-fill text-muted me-2"></i> Mon-Sat: 9:00 AM - 6:30 PM</div>
                </div>
              </div>
            </div>

            <!-- Expert 2 -->
            <div class="col-md-6">
              <div class="p-3 border rounded-3 bg-white h-100 shadow-sm hover-shadow transition-all">
                <div class="d-flex align-items-center gap-3 mb-2">
                  <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 48px; height: 48px; font-size: 1.1rem;">
                    PN
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0 text-dark">Priya Nair</h6>
                    <div class="badge bg-primary bg-opacity-10 text-primary fs-8">Lead Underwriting Specialist</div>
                    <div class="text-muted fs-8">Business & Educational Loans</div>
                  </div>
                </div>
                <hr class="my-2">
                <div class="fs-8 text-muted">
                  <div class="mb-1"><i class="bi bi-telephone-fill text-primary me-2"></i> +91 98211 88420</div>
                  <div class="mb-1"><i class="bi bi-envelope-fill text-primary me-2"></i> p.nair&#64;finflowbank.com</div>
                  <div><i class="bi bi-clock-fill text-muted me-2"></i> Mon-Fri: 9:30 AM - 7:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Instant Callback Request Form -->
          <div class="p-4 border rounded-4 bg-light">
            <h6 class="fw-bold text-dark mb-1">
              <i class="bi bi-headset me-1 text-primary"></i> Request an Instant Call Back
            </h6>
            <p class="text-muted fs-8 mb-3">Leave your contact details and our loan officer will reach out within 15 minutes.</p>

            <form (ngSubmit)="onRequestCallback()" #cbForm="ngForm">
              <div class="row g-2">
                <div class="col-sm-6">
                  <input type="text" class="form-control form-control-sm" placeholder="Your Name" [(ngModel)]="callbackName" name="callbackName" required>
                </div>
                <div class="col-sm-6">
                  <input type="tel" class="form-control form-control-sm" placeholder="10-digit Phone Number" [(ngModel)]="callbackPhone" name="callbackPhone" required>
                </div>
                <div class="col-12 mt-2">
                  <select class="form-select form-select-sm" [(ngModel)]="callbackTopic" name="callbackTopic">
                    <option value="General Query">Need assistance with Loan Application</option>
                    <option value="Doc Verification">Query regarding Document Uploads</option>
                    <option value="EMI & Interest">EMI Repayment & Interest Rates Guidance</option>
                  </select>
                </div>
                <div class="col-12 mt-3 text-end">
                  <button type="submit" class="btn btn-ff-primary btn-sm px-4 rounded-pill" [disabled]="!callbackPhone || !callbackName">
                    <i class="bi bi-send-fill me-1"></i> Request Callback
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-3 bg-light border-top text-end">
          <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" (click)="close.emit()">
            Close
          </button>
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
export class SupportAssistanceModalComponent {
  @Output() close = new EventEmitter<void>();

  toastService = inject(ToastService);

  callbackName: string = '';
  callbackPhone: string = '';
  callbackTopic: string = 'General Query';

  onRequestCallback(): void {
    if (!this.callbackPhone || !this.callbackName) return;
    this.toastService.success(`Callback requested for ${this.callbackName} (${this.callbackPhone}). Senior Relationship Manager Rajesh Sharma will contact you shortly.`, 'Request Received');
    this.callbackName = '';
    this.callbackPhone = '';
    this.close.emit();
  }
}
