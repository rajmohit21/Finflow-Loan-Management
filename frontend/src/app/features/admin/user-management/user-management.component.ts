import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="animate-fade-in">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">User & Applicant Directory</h3>
          <p class="text-muted fs-7 mb-0">Manage registered system accounts, permissions, and active status</p>
        </div>
      </div>

      <!-- Data Table -->
      <app-data-table
        [data]="users"
        [columns]="columns"
        [hasActions]="true"
        [customCellTemplate]="customCell"
        [actionsTemplate]="actionsCell"
        emptyTitle="No System Users Found"
      >
      </app-data-table>

      <!-- Custom Cells -->
      <ng-template #customCell let-row let-column="column">
        <ng-container [ngSwitch]="column.key">
          <ng-container *ngSwitchCase="'name'">
            <div class="fw-bold text-dark fs-7">{{ row.name }}</div>
            <div class="text-muted fs-8">{{ row.email }}</div>
          </ng-container>

          <ng-container *ngSwitchCase="'role'">
            <span class="badge" [ngClass]="row.role === 'ADMIN' ? 'bg-primary' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'">
              {{ row.role }}
            </span>
          </ng-container>

          <ng-container *ngSwitchCase="'active'">
            <span class="badge rounded-pill" [ngClass]="row.active !== false ? 'bg-success' : 'bg-danger'">
              {{ row.active !== false ? 'Active' : 'Disabled' }}
            </span>
          </ng-container>
        </ng-container>
      </ng-template>

      <ng-template #actionsCell let-row>
        <button 
          class="btn btn-sm"
          [ngClass]="row.active !== false ? 'btn-outline-danger' : 'btn-outline-success'"
          (click)="toggleUserStatus(row)"
        >
          {{ row.active !== false ? 'Deactivate' : 'Activate' }}
        </button>
      </ng-template>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class UserManagementComponent implements OnInit {
  http = inject(HttpClient);
  toastService = inject(ToastService);

  users: User[] = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '9876543210', role: 'APPLICANT', active: true, createdAt: '2026-01-15' },
    { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9820112233', role: 'APPLICANT', active: true, createdAt: '2026-02-01' },
    { id: 3, name: 'Vikram Malhotra', email: 'vikram.m@example.com', phone: '9711883344', role: 'APPLICANT', active: true, createdAt: '2026-02-10' },
    { id: 4, name: 'Ananya Roy', email: 'ananya.roy@example.com', phone: '9900114455', role: 'APPLICANT', active: true, createdAt: '2026-02-20' },
    { id: 99, name: 'System Underwriter', email: 'admin@finflow.com', phone: '9000000000', role: 'ADMIN', active: true, createdAt: '2026-01-01' }
  ];

  columns: TableColumn[] = [
    { key: 'id', label: 'User ID', sortable: true },
    { key: 'name', label: 'User Name & Email', sortable: true, type: 'custom' },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'role', label: 'Role', sortable: true, type: 'custom' },
    { key: 'active', label: 'Status', sortable: true, type: 'custom' }
  ];

  ngOnInit(): void {
    const isMock = environment.mockMode || localStorage.getItem('finflow_token')?.startsWith('mock_');
    if (!isMock) {
      this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
        next: (data) => {
          if (data && data.length) this.users = data;
        },
        error: () => {}
      });
    }
  }

  toggleUserStatus(user: User): void {
    user.active = !user.active;
    this.toastService.info(`User ${user.name} status set to ${user.active ? 'Active' : 'Disabled'}.`);
  }
}
