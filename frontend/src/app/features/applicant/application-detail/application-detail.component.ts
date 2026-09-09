import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { DocumentService } from '../../../core/services/document.service';
import { LoanApplication } from '../../../core/models/application.model';
import { Document } from '../../../core/models/document.model';
import { TimelineComponent } from '../../../shared/components/timeline/timeline.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DocumentViewerModalComponent } from '../../../shared/components/document-viewer-modal/document-viewer-modal.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TimelineComponent, StatusBadgeComponent, CurrencyFormatPipe, DocumentViewerModalComponent],
  template: `
    <app-document-viewer-modal [document]="selectedDoc" (close)="selectedDoc = null"></app-document-viewer-modal>

    <div *ngIf="loading" class="p-5 text-center">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2 fs-7">Loading application details...</p>
    </div>

    <div *ngIf="!loading && application" class="animate-fade-in" style="max-width: 1100px; margin: 0 auto;">
      <!-- Breadcrumb Nav -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb fs-8">
          <li class="breadcrumb-item"><a routerLink="/applicant/dashboard">Dashboard</a></li>
          <li class="breadcrumb-item"><a routerLink="/applicant/applications">My Applications</a></li>
          <li class="breadcrumb-item active">Application #{{ application.id }}</li>
        </ol>
      </nav>

      <!-- Application Banner Header -->
      <div class="ff-card p-4 mb-4 border-start border-primary border-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <h3 class="fw-extrabold mb-0 text-dark">Loan Application #{{ application.id }}</h3>
              <app-status-badge [status]="application.status"></app-status-badge>
            </div>
            <p class="text-muted fs-7 mb-0">
              Submitted on {{ application.submittedDate || application.createdDate | date:'mediumDate' }} • Type: <strong>{{ application.loanType }}</strong>
            </p>
          </div>

          <div class="text-md-end">
            <div class="text-uppercase text-muted fs-8 fw-bold">Requested Loan Amount</div>
            <div class="display-6 fw-extrabold text-primary">{{ application.loanAmount | currencyFormat }}</div>
            <span class="badge bg-success bg-opacity-10 text-success">{{ application.interestRate }}% Interest Rate</span>
          </div>
        </div>
      </div>

      <!-- Application Progress Timeline Tracker -->
      <div class="ff-card p-4 mb-4">
        <h6 class="fw-bold mb-3 text-muted text-uppercase fs-8 tracking-wider">Application Tracking Progress</h6>
        <app-timeline [currentStatus]="application.status"></app-timeline>
      </div>

      <!-- Approved Loan Monthly EMI & Repayment Breakdown -->
      <div *ngIf="application.status === 'APPROVED' || application.status === 'DISBURSED'" class="ff-card p-4 mb-4 bg-primary bg-opacity-10 border border-primary border-opacity-20 shadow-sm">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
            <i class="bi bi-calculator-fill fs-5"></i>
          </div>
          <div>
            <h6 class="fw-extrabold mb-0 text-primary fs-6">Official Sanctioned EMI & Repayment Schedule</h6>
            <div class="text-muted fs-8">Calculated based on {{ application.interestRate || 9.5 }}% p.a. fixed interest rate</div>
          </div>
        </div>

        <div class="row g-3 text-center">
          <div class="col-6 col-md-3">
            <div class="p-3 bg-white rounded-3 border shadow-sm">
              <span class="text-muted d-block fs-8 mb-1">Monthly EMI</span>
              <strong class="display-7 fw-extrabold text-success">{{ getMonthlyEMI(application.loanAmount, application.interestRate, application.loanTermMonths || application.tenureMonths) | currencyFormat }}/mo</strong>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 bg-white rounded-3 border shadow-sm">
              <span class="text-muted d-block fs-8 mb-1">Loan Tenure</span>
              <strong class="fs-5 text-dark fw-bold">{{ application.loanTermMonths || application.tenureMonths || 36 }} Months</strong>
              <div class="text-muted fs-8">({{ (application.loanTermMonths || application.tenureMonths || 36) / 12 }} Years)</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 bg-white rounded-3 border shadow-sm">
              <span class="text-muted d-block fs-8 mb-1">Total Interest Payable</span>
              <strong class="fs-5 text-dark fw-bold">{{ getTotalInterest(application.loanAmount, application.interestRate, application.loanTermMonths || application.tenureMonths) | currencyFormat }}</strong>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 bg-white rounded-3 border shadow-sm">
              <span class="text-muted d-block fs-8 mb-1">Total Amount Payable</span>
              <strong class="fs-5 text-primary fw-bold">{{ getTotalRepayment(application.loanAmount, application.interestRate, application.loanTermMonths || application.tenureMonths) | currencyFormat }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Remarks Banner if Rejected or Remarks present -->
      <div *ngIf="application.remarks" class="p-4 rounded-3 mb-4 shadow-sm" [ngClass]="application.status === 'REJECTED' ? 'bg-danger bg-opacity-10 border border-danger' : 'bg-info bg-opacity-10 border border-info'">
        <div class="d-flex align-items-center gap-2 mb-1">
          <i class="bi" [ngClass]="application.status === 'REJECTED' ? 'bi-exclamation-octagon-fill text-danger' : 'bi-info-circle-fill text-info'"></i>
          <h6 class="fw-bold mb-0" [class.text-danger]="application.status === 'REJECTED'">Underwriter Remarks & Feedback</h6>
        </div>
        <p class="fs-7 text-dark mb-0 ms-4">{{ application.remarks }}</p>
      </div>

      <!-- Details Grid Sections -->
      <div class="row g-4 mb-4">
        <!-- Personal Information -->
        <div class="col-md-6">
          <div class="ff-card p-4 h-100">
            <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">
              <i class="bi bi-person-fill me-1"></i> Personal Information
            </h6>
            <div class="row g-2 fs-7">
              <div class="col-4 text-muted">Full Name:</div>
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

        <!-- Employment & Financial Details -->
        <div class="col-md-6">
          <div class="ff-card p-4 h-100">
            <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">
              <i class="bi bi-briefcase-fill me-1"></i> Employment & Financial Details
            </h6>
            <div class="row g-2 fs-7">
              <div class="col-5 text-muted">Employer:</div>
              <div class="col-7 fw-semibold">{{ application.employerName }}</div>
              <div class="col-5 text-muted">Job Title:</div>
              <div class="col-7 fw-semibold">{{ application.jobTitle }}</div>
              <div class="col-5 text-muted">Annual Income:</div>
              <div class="col-7 fw-bold text-success">{{ application.annualIncome | currencyFormat }}</div>
              <div class="col-5 text-muted">Credit Score:</div>
              <div class="col-7 fw-semibold">{{ application.creditScore || '780' }} (CIBIL)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Uploaded Documents Card -->
      <div class="ff-card p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold text-primary mb-0">
            <i class="bi bi-paperclip me-1"></i> Linked Document Attachments
          </h6>
          <a routerLink="/applicant/documents" class="btn btn-outline-primary btn-sm">Upload More Documents</a>
        </div>

        <div *ngIf="documents.length === 0" class="text-center py-4 text-muted fs-8">
          No document attachments linked yet.
        </div>

        <div *ngIf="documents.length > 0" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-8 text-uppercase text-muted">
              <tr>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th class="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of documents">
                <td class="fw-bold text-dark fs-7">{{ doc.fileType }}</td>
                <td>
                  <i class="bi bi-file-earmark-text text-primary me-1"></i> {{ doc.fileName }}
                </td>
                <td class="text-muted fs-8">{{ doc.uploadDate | date:'short' }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': doc.status === 'VERIFIED',
                    'bg-danger': doc.status === 'REJECTED',
                    'bg-warning text-dark': doc.status === 'PENDING' || doc.status === 'UNDER_REVIEW'
                  }">{{ doc.status }}</span>
                </td>
                <td class="text-end">
                  <button type="button" (click)="selectedDoc = doc" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                    <i class="bi bi-eye"></i> View
                  </button>
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
    .tracking-wider { letter-spacing: 0.05em; }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  applicationService = inject(ApplicationService);
  documentService = inject(DocumentService);

  application: LoanApplication | null = null;
  documents: Document[] = [];
  selectedDoc: Document | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchDetail(id);
    }
  }

  fetchDetail(id: number): void {
    this.loading = true;
    this.applicationService.getApplicationById(id).subscribe({
      next: (app) => {
        this.application = app;
        this.fetchDocuments(id);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  fetchDocuments(appId: number): void {
    this.documentService.getDocumentsByApplication(appId).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getMonthlyEMI(amount: number, annualRate?: number, tenureMonths?: number): number {
    const p = amount || 0;
    const r = ((annualRate || 9.5) / 12) / 100;
    const n = tenureMonths || 36;
    if (p <= 0 || r <= 0 || n <= 0) return 0;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }

  getTotalRepayment(amount: number, annualRate?: number, tenureMonths?: number): number {
    const emi = this.getMonthlyEMI(amount, annualRate, tenureMonths);
    const n = tenureMonths || 36;
    return emi * n;
  }

  getTotalInterest(amount: number, annualRate?: number, tenureMonths?: number): number {
    const totalRepay = this.getTotalRepayment(amount, annualRate, tenureMonths);
    return totalRepay - (amount || 0);
  }
}
