import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { LoanApplication } from '../../../core/models/application.model';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, StatusBadgeComponent, CurrencyFormatPipe],
  template: `
    <div class="animate-fade-in">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">Loan Applications Directory</h3>
          <p class="text-muted fs-7 mb-0">Search, filter, inspect, and execute underwriting decisions across all system loans</p>
        </div>
      </div>

      <!-- Applications Table -->
      <app-data-table
        [data]="applications"
        [columns]="columns"
        [statusOptions]="statusOptions"
        [hasActions]="true"
        [customCellTemplate]="customCell"
        [actionsTemplate]="actionsCell"
        emptyTitle="No Loan Applications Found"
        emptySubtitle="No records match your filter parameters."
      >
      </app-data-table>

      <!-- Custom Cells -->
      <ng-template #customCell let-row let-column="column">
        <ng-container [ngSwitch]="column.key">
          <ng-container *ngSwitchCase="'id'">
            <a [routerLink]="['/admin/applications', row.id]" class="fw-bold text-primary text-decoration-none">
              #{{ row.id }}
            </a>
          </ng-container>

          <ng-container *ngSwitchCase="'fullName'">
            <div class="fw-bold text-dark fs-7">{{ row.fullName }}</div>
            <div class="text-muted fs-8">{{ row.email }}</div>
          </ng-container>

          <ng-container *ngSwitchCase="'loanType'">
            <span class="badge bg-light text-dark border me-1">{{ row.loanType }}</span>
            <span class="text-muted fs-8">{{ row.loanPurpose }}</span>
          </ng-container>

          <ng-container *ngSwitchCase="'loanAmount'">
            <span class="fw-extrabold text-dark">{{ row.loanAmount | currencyFormat }}</span>
          </ng-container>

          <ng-container *ngSwitchCase="'status'">
            <app-status-badge [status]="row.status"></app-status-badge>
          </ng-container>
        </ng-container>
      </ng-template>

      <ng-template #actionsCell let-row>
        <div class="d-flex align-items-center justify-content-end gap-2">
          <a [routerLink]="['/admin/applications', row.id]" class="btn btn-ff-primary btn-sm px-3 fw-bold">
            <i class="bi bi-eye-fill me-1"></i> Review File
          </a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class AdminApplicationsComponent implements OnInit {
  adminService = inject(AdminService);

  applications: LoanApplication[] = [];

  columns: TableColumn[] = [
    { key: 'id', label: 'App ID', sortable: true, type: 'custom' },
    { key: 'fullName', label: 'Applicant Details', sortable: true, type: 'custom' },
    { key: 'loanType', label: 'Loan Category', sortable: true, type: 'custom' },
    { key: 'loanAmount', label: 'Requested Amount', sortable: true, type: 'custom' },
    { key: 'interestRate', label: 'Interest %', sortable: true },
    { key: 'status', label: 'Current Status', sortable: true, type: 'custom' }
  ];

  statusOptions = [
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Doc Verification', value: 'DOCUMENT_VERIFICATION' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  ngOnInit(): void {
    this.adminService.getAllApplications().subscribe({
      next: (data) => this.applications = data
    });
  }
}
