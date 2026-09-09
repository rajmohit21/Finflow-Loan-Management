import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { LoanApplication } from '../../../core/models/application.model';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-applicant-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, StatusBadgeComponent, CurrencyFormatPipe],
  template: `
    <div class="animate-fade-in">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">My Loan Applications</h3>
          <p class="text-muted fs-7 mb-0">Track all your submitted and draft loan requests in real time</p>
        </div>
        <a routerLink="/applicant/apply-loan" class="btn btn-ff-primary d-inline-flex align-items-center gap-2">
          <i class="bi bi-plus-circle-fill"></i> New Loan Application
        </a>
      </div>

      <!-- Data Table Component with status filters and sorting -->
      <app-data-table
        [data]="applications"
        [columns]="columns"
        [statusOptions]="statusOptions"
        [hasActions]="true"
        [customCellTemplate]="customCell"
        [actionsTemplate]="actionsCell"
        emptyTitle="No Loan Applications Found"
        emptySubtitle="You haven't submitted any loan requests yet. Click the button above to get started."
      >
      </app-data-table>

      <!-- Custom Cell Templates -->
      <ng-template #customCell let-row let-column="column">
        <ng-container [ngSwitch]="column.key">
          <ng-container *ngSwitchCase="'id'">
            <a [routerLink]="['/applicant/applications', row.id]" class="fw-bold text-primary text-decoration-none">
              #{{ row.id }}
            </a>
          </ng-container>

          <ng-container *ngSwitchCase="'loanType'">
            <span class="fw-semibold text-dark">{{ row.loanType }}</span>
            <div class="text-muted fs-8">{{ row.loanPurpose }}</div>
          </ng-container>

          <ng-container *ngSwitchCase="'loanAmount'">
            <span class="fw-bold text-dark">{{ row.loanAmount | currencyFormat }}</span>
          </ng-container>

          <ng-container *ngSwitchCase="'monthlyEmi'">
            <span class="fw-bold text-success">{{ getMonthlyEMI(row.loanAmount, row.interestRate, row.loanTermMonths || row.tenureMonths) | currencyFormat }}/mo</span>
          </ng-container>

          <ng-container *ngSwitchCase="'interestRate'">
            <span class="text-success fw-semibold">{{ row.interestRate || 9.5 }}% p.a.</span>
          </ng-container>

          <ng-container *ngSwitchCase="'status'">
            <app-status-badge [status]="row.status"></app-status-badge>
          </ng-container>
        </ng-container>
      </ng-template>

      <ng-template #actionsCell let-row>
        <a [routerLink]="['/applicant/applications', row.id]" class="btn btn-outline-primary btn-sm rounded-pill px-3">
          View Details <i class="bi bi-chevron-right fs-8 me-0"></i>
        </a>
      </ng-template>
    </div>
  `,
  styles: [`
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class ApplicantApplicationsComponent implements OnInit {
  applicationService = inject(ApplicationService);

  applications: LoanApplication[] = [];

  columns: TableColumn[] = [
    { key: 'id', label: 'App ID', sortable: true, type: 'custom' },
    { key: 'loanType', label: 'Loan Type / Purpose', sortable: true, type: 'custom' },
    { key: 'loanAmount', label: 'Amount', sortable: true, type: 'custom' },
    { key: 'monthlyEmi', label: 'Est. Monthly EMI', type: 'custom' },
    { key: 'loanTermMonths', label: 'Tenure (Mo)', sortable: true },
    { key: 'interestRate', label: 'Interest Rate', sortable: true, type: 'custom' },
    { key: 'status', label: 'Current Status', sortable: true, type: 'custom' }
  ];

  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Doc Verification', value: 'DOCUMENT_VERIFICATION' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  ngOnInit(): void {
    this.applicationService.getMyApplications().subscribe({
      next: (data) => this.applications = data
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
}
