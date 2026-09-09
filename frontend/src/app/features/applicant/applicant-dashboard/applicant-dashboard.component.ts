import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoanApplication } from '../../../core/models/application.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, CurrencyFormatPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Top Welcome Banner -->
      <div class="p-4 p-md-5 rounded-4 bg-primary text-white position-relative overflow-hidden mb-4 shadow-lg">
        <div class="position-absolute rounded-circle bg-white bg-opacity-10" style="width: 300px; height: 300px; right: -50px; bottom: -50px; filter: blur(30px);"></div>
        <div class="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span class="badge bg-white bg-opacity-20 text-white mb-2 px-3 py-1 fw-semibold">FINFLOW FINANCIAL PORTAL</span>
            <h2 class="display-6 fw-extrabold mb-1">Welcome back, {{ currentUser?.name }}! 👋</h2>
            <p class="text-white-50 mb-0">Track loan application progress, manage uploaded documents, and calculate EMIs.</p>
          </div>
          <a routerLink="/applicant/apply-loan" class="btn btn-warning btn-lg fw-bold shadow text-dark px-4 py-2.5 rounded-3 d-inline-flex align-items-center gap-2">
            <i class="bi bi-plus-circle-fill"></i> Apply for New Loan
          </a>
        </div>
      </div>

      <!-- KPI Summary Metric Cards Grid -->
      <div class="row g-3 mb-4">
        <!-- Total Applications -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Total Applications</span>
              <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2">
                <i class="bi bi-folder-fill fs-5"></i>
              </div>
            </div>
            <div class="display-6 fw-bold mb-1">{{ applications.length }}</div>
            <div class="text-muted fs-8"><i class="bi bi-graph-up text-success me-1"></i> Active credit profile</div>
          </div>
        </div>

        <!-- Pending / In Review -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100 border-start border-warning border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Pending Review</span>
              <div class="bg-warning bg-opacity-10 text-warning rounded-3 p-2">
                <i class="bi bi-hourglass-split fs-5"></i>
              </div>
            </div>
            <div class="display-6 fw-bold mb-1 text-warning">{{ pendingCount }}</div>
            <div class="text-muted fs-8">Underwriter verification</div>
          </div>
        </div>

        <!-- Approved Loans -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100 border-start border-success border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Approved Loans</span>
              <div class="bg-success bg-opacity-10 text-success rounded-3 p-2">
                <i class="bi bi-check-circle-fill fs-5"></i>
              </div>
            </div>
            <div class="display-6 fw-bold mb-1 text-success">{{ approvedCount }}</div>
            <div class="text-muted fs-8">Ready for disbursement</div>
          </div>
        </div>

        <!-- Approved Amount -->
        <div class="col-sm-6 col-xl-3">
          <div class="ff-card p-4 ff-card-hover h-100 border-start border-info border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted fs-8 text-uppercase fw-bold">Approved Sanction</span>
              <div class="bg-info bg-opacity-10 text-info rounded-3 p-2">
                <i class="bi bi-cash-stack fs-5"></i>
              </div>
            </div>
            <div class="fs-3 fw-bold mb-1 text-info">{{ approvedAmount | currencyFormat:true }}</div>
            <div class="text-muted fs-8">Total approved capital</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <a routerLink="/applicant/apply-loan" class="text-decoration-none">
            <div class="ff-card p-3 text-center ff-card-hover">
              <div class="bg-primary text-white rounded-circle mx-auto p-3 mb-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-file-earmark-plus fs-4"></i>
              </div>
              <h6 class="fw-bold text-dark fs-7 mb-1">Apply for Loan</h6>
              <span class="text-muted fs-8">6-Step Wizard</span>
            </div>
          </a>
        </div>
        <div class="col-6 col-md-3">
          <a routerLink="/applicant/applications" class="text-decoration-none">
            <div class="ff-card p-3 text-center ff-card-hover">
              <div class="bg-info text-white rounded-circle mx-auto p-3 mb-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-list-task fs-4"></i>
              </div>
              <h6 class="fw-bold text-dark fs-7 mb-1">My Applications</h6>
              <span class="text-muted fs-8">Track status</span>
            </div>
          </a>
        </div>
        <div class="col-6 col-md-3">
          <a routerLink="/applicant/documents" class="text-decoration-none">
            <div class="ff-card p-3 text-center ff-card-hover">
              <div class="bg-warning text-white rounded-circle mx-auto p-3 mb-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-cloud-arrow-up fs-4"></i>
              </div>
              <h6 class="fw-bold text-dark fs-7 mb-1">Upload Documents</h6>
              <span class="text-muted fs-8">KYC & Financials</span>
            </div>
          </a>
        </div>
        <div class="col-6 col-md-3">
          <a routerLink="/applicant/profile" class="text-decoration-none">
            <div class="ff-card p-3 text-center ff-card-hover">
              <div class="bg-success text-white rounded-circle mx-auto p-3 mb-2 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-person-gear fs-4"></i>
              </div>
              <h6 class="fw-bold text-dark fs-7 mb-1">Update Profile</h6>
              <span class="text-muted fs-8">Income & Details</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Main Content Split: Recent Applications Table & Notifications -->
      <div class="row g-4">
        <!-- Recent Applications Table -->
        <div class="col-lg-8">
          <div class="ff-card p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0">Recent Loan Applications</h5>
              <a routerLink="/applicant/applications" class="text-primary fw-semibold fs-8 text-decoration-none">View All <i class="bi bi-arrow-right"></i></a>
            </div>

            <div *ngIf="loading" class="p-5 text-center">
              <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div *ngIf="!loading && applications.length === 0" class="text-center py-5">
              <i class="bi bi-folder-plus text-muted fs-1 d-block mb-2"></i>
              <h6 class="fw-bold text-muted">No Applications Submitted Yet</h6>
              <p class="text-muted fs-8 mb-3">Get started by filling out your first loan application form.</p>
              <a routerLink="/applicant/apply-loan" class="btn btn-ff-primary btn-sm">Start Application</a>
            </div>

            <div *ngIf="!loading && applications.length > 0" class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr class="fs-8 text-uppercase text-muted">
                    <th>ID</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Interest</th>
                    <th>Status</th>
                    <th class="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let app of recentApplications">
                    <td class="fw-bold text-primary">#{{ app.id }}</td>
                    <td>
                      <span class="fw-semibold text-dark">{{ app.loanType }}</span>
                      <div class="text-muted fs-8">{{ app.loanPurpose }}</div>
                    </td>
                    <td class="fw-bold">{{ app.loanAmount | currencyFormat }}</td>
                    <td class="text-success fw-semibold">{{ app.interestRate }}% p.a.</td>
                    <td>
                      <app-status-badge [status]="app.status"></app-status-badge>
                    </td>
                    <td class="text-end">
                      <a [routerLink]="['/applicant/applications', app.id]" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                        Details <i class="bi bi-chevron-right fs-8"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Side Widget: In-App Notifications & EMI Shortcut -->
        <div class="col-lg-4">
          <div class="ff-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Recent Alerts</h5>
                <a routerLink="/applicant/notifications" class="text-primary fs-8 text-decoration-none">Notification Hub</a>
              </div>

              <div *ngFor="let notif of recentNotifications" class="p-3 bg-light rounded-3 mb-2 border-start border-primary border-3">
                <div class="fw-bold fs-7 mb-1 text-dark">{{ notif.title }}</div>
                <p class="text-muted fs-8 mb-1">{{ notif.message }}</p>
                <span class="text-muted fs-8 opacity-75"><i class="bi bi-clock me-1"></i>{{ notif.timestamp }}</span>
              </div>
            </div>

            <!-- Quick EMI Promo Box -->
            <div class="p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25 mt-4 text-center">
              <i class="bi bi-calculator text-primary fs-2 d-block mb-1"></i>
              <h6 class="fw-bold text-primary mb-1">Interactive EMI Calculator</h6>
              <p class="text-muted fs-8 mb-2">Simulate monthly tenure & repayment breakdown before applying.</p>
              <a routerLink="/applicant/apply-loan" class="btn btn-outline-primary btn-sm w-100">Calculate EMI Now</a>
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
export class ApplicantDashboardComponent implements OnInit {
  authService = inject(AuthService);
  applicationService = inject(ApplicationService);
  notificationService = inject(NotificationService);

  currentUser = this.authService.currentUserValue;
  applications: LoanApplication[] = [];
  recentApplications: LoanApplication[] = [];
  recentNotifications: any[] = [];
  loading: boolean = true;

  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  approvedAmount: number = 0;

  ngOnInit(): void {
    this.recentNotifications = (this.notificationService.notificationsSignal() || []).slice(0, 3);
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.calculateMetrics();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateMetrics(): void {
    this.recentApplications = this.applications.slice(0, 5);
    this.pendingCount = this.applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFICATION'].includes(a.status)).length;
    this.approvedCount = this.applications.filter(a => ['APPROVED', 'DISBURSED'].includes(a.status)).length;
    this.rejectedCount = this.applications.filter(a => a.status === 'REJECTED').length;
    this.approvedAmount = this.applications
      .filter(a => ['APPROVED', 'DISBURSED'].includes(a.status))
      .reduce((sum, a) => sum + (a.loanAmount || 0), 0);
  }
}
