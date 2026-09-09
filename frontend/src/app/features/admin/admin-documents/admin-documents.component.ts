import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../core/services/document.service';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { Document } from '../../../core/models/document.model';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { DocumentViewerModalComponent } from '../../../shared/components/document-viewer-modal/document-viewer-modal.component';

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [CommonModule, DataTableComponent, DocumentViewerModalComponent],
  template: `
    <app-document-viewer-modal [document]="selectedDoc" (close)="selectedDoc = null"></app-document-viewer-modal>

    <div class="animate-fade-in">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">Document Audit Hub</h3>
          <p class="text-muted fs-7 mb-0">System-wide file verification queue for KYC compliance</p>
        </div>
      </div>

      <app-data-table
        [data]="documents"
        [columns]="columns"
        [hasActions]="true"
        [customCellTemplate]="customCell"
        [actionsTemplate]="actionsCell"
        emptyTitle="No Documents Pending Audit"
      >
      </app-data-table>

      <ng-template #customCell let-row let-column="column">
        <ng-container [ngSwitch]="column.key">
          <ng-container *ngSwitchCase="'applicationId'">
            <span class="fw-bold text-primary">#{{ row.applicationId }}</span>
          </ng-container>

          <ng-container *ngSwitchCase="'fileType'">
            <span class="badge bg-light text-dark border">{{ row.fileType }}</span>
          </ng-container>

          <ng-container *ngSwitchCase="'fileName'">
            <i class="bi bi-file-earmark-pdf text-danger me-1"></i>
            <span class="fw-semibold text-dark fs-7">{{ row.fileName }}</span>
          </ng-container>

          <ng-container *ngSwitchCase="'status'">
            <span class="badge" [ngClass]="{
              'bg-success': row.status === 'VERIFIED',
              'bg-danger': row.status === 'REJECTED',
              'bg-warning text-dark': row.status === 'PENDING' || row.status === 'UNDER_REVIEW'
            }">{{ row.status }}</span>
          </ng-container>
        </ng-container>
      </ng-template>

      <ng-template #actionsCell let-row>
        <div class="btn-group btn-group-sm">
          <button type="button" (click)="selectedDoc = row" class="btn btn-outline-secondary">
            <i class="bi bi-eye"></i> View
          </button>
          <button class="btn btn-outline-success" (click)="verify(row.id, 'VERIFIED')">
            <i class="bi bi-check-lg"></i>
          </button>
          <button class="btn btn-outline-danger" (click)="verify(row.id, 'REJECTED')">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
  `]
})
export class AdminDocumentsComponent implements OnInit {
  documentService = inject(DocumentService);
  adminService = inject(AdminService);
  toastService = inject(ToastService);

  documents: Document[] = [];
  selectedDoc: Document | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: 'Doc ID', sortable: true },
    { key: 'applicationId', label: 'App ID', sortable: true, type: 'custom' },
    { key: 'fileType', label: 'Category', sortable: true, type: 'custom' },
    { key: 'fileName', label: 'File Name', sortable: true, type: 'custom' },
    { key: 'status', label: 'Verification Status', sortable: true, type: 'custom' }
  ];

  ngOnInit(): void {
    this.fetchDocs();
  }

  fetchDocs(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (docs) => this.documents = docs
    });
  }

  verify(id: number, status: string): void {
    this.adminService.verifyDocument(id, status).subscribe({
      next: () => {
        this.toastService.success(`Document #${id} set to ${status}.`);
        this.fetchDocs();
      }
    });
  }
}
