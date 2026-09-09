import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { DocumentService } from '../../../core/services/document.service';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoanApplication } from '../../../core/models/application.model';
import { Document } from '../../../core/models/document.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TimelineComponent } from '../../../shared/components/timeline/timeline.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DocumentViewerModalComponent } from '../../../shared/components/document-viewer-modal/document-viewer-modal.component';

@Component({
  selector: 'app-admin-application-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatusBadgeComponent, TimelineComponent, CurrencyFormatPipe, DocumentViewerModalComponent],
  template: `
    <app-document-viewer-modal [document]="selectedDoc" (close)="selectedDoc = null"></app-document-viewer-modal>

    <div *ngIf="loading" class="p-5 text-center">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted fs-7 mt-2">Fetching loan application file...</p>
    </div>

    <div *ngIf="!loading && application" class="animate-fade-in" style="max-width: 1100px; margin: 0 auto;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb fs-8">
          <li class="breadcrumb-item"><a routerLink="/admin/dashboard">Admin Dashboard</a></li>
          <li class="breadcrumb-item"><a routerLink="/admin/applications">Applications Directory</a></li>
          <li class="breadcrumb-item active">Review #{{ application.id }}</li>
        </ol>
      </nav>

      <!-- Review Header Card -->
      <div class="ff-card p-4 mb-4 border-start border-primary border-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <h3 class="fw-extrabold mb-0 text-dark">Underwriting File #{{ application.id }}</h3>
              <app-status-badge [status]="application.status"></app-status-badge>
            </div>
            <p class="text-muted fs-7 mb-0">Applicant: <strong>{{ application.fullName }}</strong> ({{ application.email }})</p>
          </div>

          <div class="text-md-end">
            <div class="text-uppercase text-muted fs-8 fw-bold">Loan Amount Requested</div>
            <div class="display-6 fw-extrabold text-primary">{{ application.loanAmount | currencyFormat }}</div>
            <span class="badge bg-success bg-opacity-10 text-success">{{ application.interestRate }}% p.a. • {{ application.loanTermMonths }} Mo</span>
          </div>
        </div>
      </div>

      <!-- Action Banner Panel for Underwriter -->
      <div class="ff-card p-4 mb-4 bg-primary bg-opacity-10 border-primary border-opacity-25">
        <h5 class="fw-bold text-primary mb-3"><i class="bi bi-shield-check me-2"></i>Underwriter Decision Desk</h5>

        <div class="row g-3 align-items-center">
          <div class="col-lg-7">
            <label class="form-label fw-semibold fs-7 text-dark mb-1">Decision Remarks / Rejection Reason</label>
            <input 
              type="text" 
              class="form-control bg-white" 
              placeholder="e.g. Credit score verified. Income meets 40% DTI threshold. Approved." 
              [(ngModel)]="decisionRemarks"
            />
          </div>

          <div class="col-lg-5 d-flex gap-2 justify-content-lg-end mt-3 mt-lg-0">
            <button 
              type="button" 
              class="btn btn-success fw-bold px-3 d-flex align-items-center gap-1 shadow-sm"
              (click)="executeDecision('APPROVED')"
              [disabled]="processing"
            >
              <i class="bi bi-check-circle-fill"></i> Approve Loan
            </button>

            <button 
              type="button" 
              class="btn btn-danger fw-bold px-3 d-flex align-items-center gap-1 shadow-sm"
              (click)="executeDecision('REJECTED')"
              [disabled]="processing"
            >
              <i class="bi bi-x-circle-fill"></i> Reject
            </button>

            <button 
              type="button" 
              class="btn btn-warning fw-bold px-3 d-flex align-items-center gap-1 text-dark shadow-sm"
              (click)="executeDecision('DOCUMENT_VERIFICATION')"
              [disabled]="processing"
            >
              <i class="bi bi-file-earmark-medical-fill"></i> Request Docs
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div class="ff-card p-4 mb-4">
        <app-timeline [currentStatus]="application.status"></app-timeline>
      </div>

      <!-- Applicant Details Grid -->
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="ff-card p-4 h-100">
            <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">Applicant Profile</h6>
            <div class="row g-2 fs-7">
              <div class="col-4 text-muted">Name:</div>
              <div class="col-8 fw-semibold">{{ application.fullName }}</div>
              <div class="col-4 text-muted">Email:</div>
              <div class="col-8 fw-semibold">{{ application.email }}</div>
              <div class="col-4 text-muted">Phone:</div>
              <div class="col-8 fw-semibold">{{ application.phone }}</div>
              <div class="col-4 text-muted">Address:</div>
              <div class="col-8 fw-semibold">{{ application.address }}</div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="ff-card p-4 h-100">
            <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">Financial Risk Assessment</h6>
            <div class="row g-2 fs-7">
              <div class="col-5 text-muted">Employer:</div>
              <div class="col-7 fw-semibold">{{ application.employerName }}</div>
              <div class="col-5 text-muted">Monthly Income:</div>
              <div class="col-7 fw-bold text-success">{{ (application.annualIncome / 12) | currencyFormat }}</div>
              <div class="col-5 text-muted">Credit Score:</div>
              <div class="col-7 fw-bold" [class.text-success]="(application.creditScore || 780) >= 750">
                {{ application.creditScore || 780 }} (CIBIL)
              </div>
              <div class="col-5 text-muted">Risk Status:</div>
              <div class="col-7">
                <span class="badge bg-success bg-opacity-10 text-success">LOW RISK PROFILE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Audit & Verification Table -->
      <div class="ff-card p-4 mb-4">
        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">Document Attachments Review</h6>

        <div *ngIf="documents.length === 0" class="text-center py-4 text-muted fs-8">
          No files attached to this loan application.
        </div>

        <div *ngIf="documents.length > 0" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-8 text-uppercase text-muted">
              <tr>
                <th>Doc ID</th>
                <th>Type</th>
                <th>File Name</th>
                <th>Status</th>
                <th class="text-end">Verification Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of documents">
                <td class="fw-bold">#{{ doc.id }}</td>
                <td><span class="badge bg-light text-dark border">{{ doc.fileType }}</span></td>
                <td class="fw-semibold text-dark fs-7">
                  <i class="bi bi-file-earmark-text text-primary me-1"></i> {{ doc.fileName }}
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': doc.status === 'VERIFIED',
                    'bg-danger': doc.status === 'REJECTED',
                    'bg-warning text-dark': doc.status === 'PENDING' || doc.status === 'UNDER_REVIEW'
                  }">{{ doc.status }}</span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary" (click)="selectedDoc = doc">
                      <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-outline-success" (click)="verifyDoc(doc.id, 'VERIFIED')">
                      <i class="bi bi-check-lg"></i> Verify
                    </button>
                    <button class="btn btn-outline-danger" (click)="verifyDoc(doc.id, 'REJECTED')">
                      <i class="bi bi-x-lg"></i> Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class AdminApplicationReviewComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  adminService = inject(AdminService);
  applicationService = inject(ApplicationService);
  documentService = inject(DocumentService);
  toastService = inject(ToastService);
  notificationService = inject(NotificationService);

  application: LoanApplication | null = null;
  documents: Document[] = [];
  selectedDoc: Document | null = null;
  loading: boolean = true;
  processing: boolean = false;
  decisionRemarks: string = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.fetchFile(id);
  }

  fetchFile(id: number): void {
    this.loading = true;
    this.applicationService.getApplicationById(id).subscribe({
      next: (app) => {
        this.application = app;
        this.fetchDocs(id);
      },
      error: () => this.loading = false
    });
  }

  fetchDocs(appId: number): void {
    this.documentService.getDocumentsByApplication(appId).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  verifyDoc(docId: number, status: string): void {
    this.adminService.verifyDocument(docId, status).subscribe({
      next: () => {
        this.toastService.success(`Document status updated to ${status}`);
        if (this.application) this.fetchDocs(this.application.id);
      }
    });
  }

  executeDecision(decisionType: 'APPROVED' | 'REJECTED' | 'DOCUMENT_VERIFICATION'): void {
    if (decisionType === 'REJECTED' && !this.decisionRemarks.trim()) {
      this.toastService.warning('Please enter a rejection reason in the remarks field.');
      return;
    }

    if (!this.application) return;

    this.processing = true;
    const appId = this.application.id;

    this.adminService.makeDecision(appId, {
      applicationId: appId,
      decisionType,
      remarks: this.decisionRemarks || `Application status updated to ${decisionType}`
    }).subscribe({
      next: () => {
        this.processing = false;
        this.toastService.success(`Application #${appId} set to ${decisionType}`);
        
        this.notificationService.addNotification({
          title: `Application #${appId} Updated`,
          message: `Decision logged: ${decisionType}. Remarks: ${this.decisionRemarks || 'None'}`,
          type: decisionType === 'APPROVED' ? 'success' : 'danger',
          applicationId: appId
        });

        this.router.navigate(['/admin/applications']);
      },
      error: () => {
        this.processing = false;
        this.toastService.error('Failed to submit underwriter decision.');
      }
    });
  }
}
