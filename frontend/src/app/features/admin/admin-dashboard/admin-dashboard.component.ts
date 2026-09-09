import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ApplicationService } from '../../../core/services/application.service';
import { LoanApplication } from '../../../core/models/application.model';
import { Report } from '../../../core/models/report.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, CurrencyFormatPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Admin Header Banner -->
      <div class="p-4 p-md-5 rounded-4 bg-dark text-white position-relative overflow-hidden mb-4 shadow-lg">
        <div class="position-absolute rounded-circle bg-primary bg-opacity-20" style="width: 350px; height: 350px; right: -50px; bottom: -50px; filter: blur(40px);"></div>
        <div class="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span class="badge bg-primary px-3 py-1 mb-2 fw-semibold">UNDERWRITING COMMAND CENTER</span>
            <h2 class="display-6 fw-extrabold mb-1">Executive Loan Portfolio Analytics</h2>
            <p class="text-white-50 mb-0">System-wide credit risk metrics, decision queues, and audit trails.</p>
          </div>
          <a routerLink="/admin/applications" class="btn btn-primary btn-lg fw-bold shadow px-4">
            <i class="bi bi-shield-check me-1"></i> Review Applications Queue
          </a>
        </div>
      </div>

      <!-- KPI Executive Metrics Row -->
      <div class="row g-3 mb-4">
        <!-- Total Applications -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Total Applications</span>
              <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2">
                <i class="bi bi-file-earmark-text-fill fs-5"></i>
              </div>
            </div>
            <div class="display-6 fw-extrabold mb-1">{{ applications.length }}</div>
            <div class="text-muted fs-8">Across 5 loan categories</div>
          </div>
        </div>

        <!-- Pending Review -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100 border-start border-warning border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Action Needed</span>
              <div class="bg-warning bg-opacity-10 text-warning rounded-3 p-2">
                <i class="bi bi-clock-history fs-5"></i>
              </div>
            </div>
            <div class="display-6 fw-extrabold mb-1 text-warning">{{ pendingCount }}</div>
            <div class="text-muted fs-8">Awaiting credit decision</div>
          </div>
        </div>

        <!-- Approved Ratio -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100 border-start border-success border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Approved Loans</span>
              <div class="bg-success bg-opacity-10 text-success rounded-3 p-2">
                <i class="bi bi-patch-check-fill fs-5"></i>
              </div>
            </div>
            <div class="display-6 fw-extrabold mb-1 text-success">{{ approvedCount }}</div>
            <div class="text-muted fs-8">Approval Rate: {{ approvalRate | number:'1.0-0' }}%</div>
          </div>
        </div>

        <!-- Total Disbursed Capital -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100 border-start border-info border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Total Capital Exposure</span>
              <div class="bg-info bg-opacity-10 text-info rounded-3 p-2">
                <i class="bi bi-bank2 fs-5"></i>
              </div>
            </div>
            <div class="fs-3 fw-extrabold mb-1 text-info">{{ totalCapital | currencyFormat:true }}</div>
            <div class="text-muted fs-8">Sum of all loan requests</div>
          </div>
        </div>
      </div>

      <!-- Portfolio Distribution & Breakdown Visual Charts -->
      <div class="row g-4 mb-4">
        <!-- Loan Type Distribution Progress Bars -->
        <div class="col-lg-6">
          <div class="ff-card p-4 h-100">
            <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-pie-chart-fill text-primary"></i> Applications by Loan Category
            </h5>

            <div *ngFor="let cat of categoryBreakdown" class="mb-3">
              <div class="d-flex justify-content-between fs-7 mb-1">
                <span class="fw-semibold text-dark">{{ cat.type }} Loan</span>
                <span class="fw-bold">{{ cat.count }} ({{ cat.percentage | number:'1.0-0' }}%)</span>
              </div>
              <div class="progress" style="height: 10px;">
                <div class="progress-bar" [ngClass]="cat.colorClass" [style.width.%]="cat.percentage"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Approval vs Rejection Ratio Visual Gauge -->
        <div class="col-lg-6">
          <div class="ff-card p-4 h-100">
            <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-shield-check text-success"></i> Underwriting Approval Ratio
            </h5>

            <div class="d-flex align-items-center justify-content-around my-4 text-center">
              <div>
                <div class="display-4 fw-extrabold text-success">{{ approvedCount }}</div>
                <div class="fw-semibold fs-7 text-muted">Approved</div>
              </div>
              <div class="vr style-vr"></div>
              <div>
                <div class="display-4 fw-extrabold text-warning">{{ pendingCount }}</div>
                <div class="fw-semibold fs-7 text-muted">Pending</div>
              </div>
              <div class="vr style-vr"></div>
              <div>
                <div class="display-4 fw-extrabold text-danger">{{ rejectedCount }}</div>
                <div class="fw-semibold fs-7 text-muted">Rejected</div>
              </div>
            </div>

            <div class="progress" style="height: 14px;">
              <div class="progress-bar bg-success" [style.width.%]="(approvedCount / (applications.length || 1)) * 100" title="Approved"></div>
              <div class="progress-bar bg-warning" [style.width.%]="(pendingCount / (applications.length || 1)) * 100" title="Pending"></div>
              <div class="progress-bar bg-danger" [style.width.%]="(rejectedCount / (applications.length || 1)) * 100" title="Rejected"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Underwriting Queue Table -->
      <div class="ff-card p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Underwriting Decision Queue</h5>
          <a routerLink="/admin/applications" class="text-primary fw-semibold fs-8 text-decoration-none">Manage All Queue <i class="bi bi-arrow-right"></i></a>
        </div>

        <div *ngIf="loading" class="p-5 text-center">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div *ngIf="!loading && applications.length === 0" class="text-center py-4 text-muted fs-8">
          No loan applications currently registered in the database.
        </div>

        <div *ngIf="!loading && applications.length > 0" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-8 text-uppercase text-muted">
              <tr>
                <th>App ID</th>
                <th>Applicant</th>
                <th>Category</th>
                <th>Requested Amount</th>
                <th>CIBIL Score</th>
                <th>Status</th>
                <th class="text-end">Underwriting Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of recentApplications">
                <td class="fw-bold text-primary">#{{ app.id }}</td>
                <td>
                  <div class="fw-bold text-dark fs-7">{{ app.fullName }}</div>
                  <div class="text-muted fs-8">{{ app.email }}</div>
                </td>
                <td><span class="badge bg-light text-dark border">{{ app.loanType }}</span></td>
                <td class="fw-bold text-dark">{{ app.loanAmount | currencyFormat }}</td>
                <td>
                  <span class="badge" [ngClass]="(app.creditScore || 750) >= 750 ? 'bg-success' : 'bg-warning text-dark'">
                    {{ app.creditScore || 750 }}
                  </span>
                </td>
                <td><app-status-badge [status]="app.status"></app-status-badge></td>
                <td class="text-end">
                  <a [routerLink]="['/admin/applications', app.id]" class="btn btn-ff-primary btn-sm px-3 fw-bold">
                    Review File <i class="bi bi-arrow-right ms-1"></i>
                  </a>
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
    .style-vr { height: 50px; opacity: 0.2; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  adminService = inject(AdminService);

  applications: LoanApplication[] = [];
  recentApplications: LoanApplication[] = [];
  loading: boolean = true;

  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  totalCapital: number = 0;
  approvalRate: number = 0;

  categoryBreakdown: { type: string; count: number; percentage: number; colorClass: string }[] = [];

  ngOnInit(): void {
    this.fetchAdminDashboard();
  }

  fetchAdminDashboard(): void {
    this.loading = true;
    this.adminService.getAllApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.calculateMetrics();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  calculateMetrics(): void {
    this.recentApplications = this.applications.slice(0, 5);
    this.pendingCount = this.applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFICATION'].includes(a.status)).length;
    this.approvedCount = this.applications.filter(a => ['APPROVED', 'DISBURSED'].includes(a.status)).length;
    this.rejectedCount = this.applications.filter(a => a.status === 'REJECTED').length;
    this.totalCapital = this.applications.reduce((sum, a) => sum + (a.loanAmount || 0), 0);

    const decided = this.approvedCount + this.rejectedCount;
    this.approvalRate = decided > 0 ? (this.approvedCount / decided) * 100 : 80;

    // Breakdown
    const categories = ['PERSONAL', 'HOME', 'EDUCATION', 'BUSINESS', 'VEHICLE'];
    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-danger'];

    const total = this.applications.length || 1;
    this.categoryBreakdown = categories.map((cat, idx) => {
      const count = this.applications.filter(a => (a.loanType || '').toUpperCase() === cat).length;
      return {
        type: cat,
        count,
        percentage: (count / total) * 100,
        colorClass: colors[idx % colors.length]
      };
    });
  }
}
