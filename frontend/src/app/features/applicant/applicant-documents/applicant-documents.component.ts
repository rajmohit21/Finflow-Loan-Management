import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../core/services/document.service';
import { ApplicationService } from '../../../core/services/application.service';
import { ToastService } from '../../../core/services/toast.service';
import { Document, FileType } from '../../../core/models/document.model';
import { LoanApplication } from '../../../core/models/application.model';
import { FileDropDirective } from '../../../shared/directives/file-drop.directive';
import { DocumentViewerModalComponent } from '../../../shared/components/document-viewer-modal/document-viewer-modal.component';

@Component({
  selector: 'app-applicant-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, FileDropDirective, DocumentViewerModalComponent],
  template: `
    <app-document-viewer-modal [document]="selectedDoc" (close)="selectedDoc = null"></app-document-viewer-modal>

    <div class="animate-fade-in">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">Document Management Hub</h3>
          <p class="text-muted fs-7 mb-0">Upload, preview, and track verification status of mandatory KYC and income files</p>
        </div>
      </div>

      <!-- Upload Form Card -->
      <div class="ff-card p-4 mb-4">
        <h5 class="fw-bold mb-3 text-primary"><i class="bi bi-cloud-upload-fill me-2"></i>Upload New Attachment</h5>
        
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold fs-7 text-muted">Select Loan Application</label>
            <select class="form-select" [(ngModel)]="selectedApplicationId" (change)="fetchDocs()">
              <option *ngFor="let app of myApplications" [value]="app.id">
                Application #{{ app.id }} ({{ app.loanType }} - ₹{{ app.loanAmount }})
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold fs-7 text-muted">Document Type / Category</label>
            <select class="form-select" [(ngModel)]="selectedFileType">
              <option value="AADHAAR">Aadhaar Card (Identity Proof)</option>
              <option value="PAN_CARD">PAN Card (Tax Identification)</option>
              <option value="SALARY_SLIP">Salary Payslip (Income Proof)</option>
              <option value="BANK_STATEMENT">Bank Statement (6 Months)</option>
              <option value="EMPLOYMENT_PROOF">Employment Letter / ID</option>
            </select>
          </div>
        </div>

        <!-- Drag & Drop Zone -->
        <div class="upload-dragzone" appFileDrop (fileDropped)="onFileDropped($event)">
          <i class="bi bi-file-earmark-arrow-up display-5 text-primary d-block mb-2"></i>
          <h6 class="fw-bold mb-1">Drag and drop file here</h6>
          <p class="text-muted fs-8 mb-3">PDF, PNG, JPG (Max size: 5MB)</p>
          
          <input type="file" #fileInput class="d-none" (change)="onFileSelect($event)" accept=".pdf,.jpg,.jpeg,.png">
          <button type="button" class="btn btn-outline-primary btn-sm px-4 fw-semibold" (click)="fileInput.click()">
            Browse File
          </button>
        </div>

        <!-- Selected File Preview Bar -->
        <div *ngIf="stagedFile" class="p-3 bg-light rounded-3 mt-3 d-flex align-items-center justify-content-between border">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-file-earmark-check-fill text-success fs-3"></i>
            <div>
              <div class="fw-bold fs-7">{{ stagedFile.name }}</div>
              <div class="text-muted fs-8">{{ (stagedFile.size / 1024 / 1024) | number:'1.2-2' }} MB</div>
            </div>
          </div>
          <button class="btn btn-ff-primary btn-sm px-4" (click)="uploadNow()" [disabled]="uploading">
            <span *ngIf="uploading" class="spinner-border spinner-border-sm me-1"></span>
            <span>{{ uploading ? 'Uploading...' : 'Confirm Upload' }}</span>
          </button>
        </div>
      </div>

      <!-- My Uploaded Documents Grid / Table -->
      <div class="ff-card p-4">
        <h5 class="fw-bold mb-3">My Uploaded Documents List</h5>

        <div *ngIf="documents.length === 0" class="text-center py-5 text-muted fs-8">
          <i class="bi bi-folder-x fs-1 d-block mb-2"></i>
          No document uploads found for your active applications.
        </div>

        <div *ngIf="documents.length > 0" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-8 text-uppercase text-muted">
              <tr>
                <th>App ID</th>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Admin Remarks</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of documents">
                <td class="fw-bold text-primary">#{{ doc.applicationId }}</td>
                <td><span class="badge bg-light text-dark border">{{ doc.fileType }}</span></td>
                <td class="fw-semibold text-dark fs-7">
                  <i class="bi bi-file-earmark-pdf text-danger me-1"></i> {{ doc.fileName }}
                </td>
                <td class="text-muted fs-8">{{ doc.uploadDate | date:'medium' }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': doc.status === 'VERIFIED',
                    'bg-danger': doc.status === 'REJECTED',
                    'bg-warning text-dark': doc.status === 'PENDING' || doc.status === 'UNDER_REVIEW'
                  }">{{ doc.status }}</span>
                </td>
                <td class="fs-8 text-muted">{{ doc.remarks || '—' }}</td>
                <td class="text-end">
                  <button type="button" (click)="selectedDoc = doc" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                    <i class="bi bi-eye me-1"></i> Preview
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
  `]
})
export class ApplicantDocumentsComponent implements OnInit {
  documentService = inject(DocumentService);
  applicationService = inject(ApplicationService);
  toastService = inject(ToastService);

  documents: Document[] = [];
  myApplications: LoanApplication[] = [];
  selectedDoc: Document | null = null;
  
  selectedApplicationId: number = 101;
  selectedFileType: string = 'SALARY_SLIP';
  stagedFile: File | null = null;
  uploading: boolean = false;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.applicationService.getMyApplications().subscribe({
      next: (apps) => {
        this.myApplications = apps;
        if (apps.length > 0) this.selectedApplicationId = apps[0].id;
        this.fetchDocs();
      }
    });
  }

  fetchDocs(): void {
    this.documentService.getDocumentsByApplication(this.selectedApplicationId).subscribe({
      next: (docs) => this.documents = docs
    });
  }

  onFileDropped(files: any): void {
    const list: FileList = files as FileList;
    if (list && list.length > 0) this.stagedFile = list[0];
  }

  onFileSelect(evt: any): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.stagedFile = evt.target.files[0];
    }
  }

  uploadNow(): void {
    if (!this.stagedFile || !this.selectedApplicationId) return;

    this.uploading = true;
    this.documentService.uploadDocument(this.selectedApplicationId, this.selectedFileType, this.stagedFile).subscribe({
      next: (doc) => {
        this.uploading = false;
        this.stagedFile = null;
        this.toastService.success(`Document '${doc.fileName}' uploaded successfully.`);
        this.fetchDocs();
      },
      error: () => {
        this.uploading = false;
        this.toastService.error('Upload failed. Check file size or format.');
      }
    });
  }
}
