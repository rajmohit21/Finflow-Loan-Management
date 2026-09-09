import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Report } from '../../../core/models/report.model';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">System Audit Logs & Reports</h3>
          <p class="text-muted fs-7 mb-0">RabbitMQ event streams and audit trails across all microservices</p>
        </div>
      </div>

      <div class="ff-card p-4">
        <h5 class="fw-bold mb-3"><i class="bi bi-activity text-primary me-2"></i>Asynchronous RabbitMQ Audit Activity Stream</h5>

        <div *ngIf="reports.length === 0" class="text-center py-5 text-muted fs-8">
          No audit reports recorded yet.
        </div>

        <div *ngIf="reports.length > 0" class="list-group list-group-flush">
          <div *ngFor="let rep of reports" class="list-group-item p-3 border-bottom rounded-3 mb-2 bg-light">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge" [ngClass]="{
                'bg-primary': rep.eventType === 'APPLICATION_SUBMITTED',
                'bg-info': rep.eventType === 'DOCUMENT_UPLOADED',
                'bg-success': rep.eventType === 'UNDERWRITER_DECISION',
                'bg-secondary': rep.eventType === 'DOCUMENT_VERIFIED'
              }">{{ rep.eventType }}</span>
              <span class="text-muted fs-8"><i class="bi bi-clock me-1"></i>{{ rep.timestamp | date:'medium' }}</span>
            </div>
            <p class="fw-semibold text-dark fs-7 mb-1">{{ rep.description }}</p>
            <div class="text-muted fs-8">
              Source Microservice: <span class="badge bg-dark bg-opacity-75">{{ rep.sourceService }}</span>
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
export class AdminReportsComponent implements OnInit {
  adminService = inject(AdminService);
  reports: Report[] = [];

  ngOnInit(): void {
    this.adminService.getReports().subscribe({
      next: (data) => this.reports = data
    });
  }
}
