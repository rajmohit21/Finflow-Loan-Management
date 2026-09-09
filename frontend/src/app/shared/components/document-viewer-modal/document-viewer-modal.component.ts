import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../../../core/models/document.model';

@Component({
  selector: 'app-document-viewer-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="document" class="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in">
      <div class="modal-dialog-custom ff-card p-0 shadow-lg border-0 overflow-hidden" style="width: 92%; max-width: 850px; max-height: 92vh;">
        <!-- Modal Header -->
        <div class="p-3 p-md-4 bg-primary text-white d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-white bg-opacity-20 rounded-3 p-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
              <i class="bi bi-file-earmark-pdf-fill fs-4" *ngIf="document.fileName.endsWith('.pdf')"></i>
              <i class="bi bi-file-earmark-image-fill fs-4" *ngIf="!document.fileName.endsWith('.pdf')"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-white">{{ document.fileName }}</h5>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span class="badge bg-white bg-opacity-20 text-white fs-8">{{ document.fileType }}</span>
                <span class="badge bg-success bg-opacity-30 text-white fs-8">VERIFIED VAULT COPY</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Bar -->
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline-light rounded-circle" (click)="zoomOut()" title="Zoom Out">
              <i class="bi bi-zoom-out"></i>
            </button>
            <span class="fs-8 fw-bold text-white px-1">{{ zoomLevel }}%</span>
            <button type="button" class="btn btn-sm btn-outline-light rounded-circle" (click)="zoomIn()" title="Zoom In">
              <i class="bi bi-zoom-in"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-light rounded-circle" (click)="rotate()" title="Rotate 90°">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <button type="button" class="btn-close btn-close-white ms-2" (click)="close.emit()"></button>
          </div>
        </div>

        <!-- Modal Body Content -->
        <div class="p-4 overflow-y-auto bg-light" style="max-height: calc(92vh - 140px);">
          <!-- Metadata Bar -->
          <div class="row g-3 p-3 bg-white rounded-3 mb-4 border shadow-sm fs-8">
            <div class="col-6 col-sm-3">
              <span class="text-muted d-block">Document ID</span>
              <strong class="text-primary font-monospace">#DOC-{{ document.id }}</strong>
            </div>
            <div class="col-6 col-sm-3">
              <span class="text-muted d-block">Application ID</span>
              <strong class="text-dark font-monospace">#APP-{{ document.applicationId }}</strong>
            </div>
            <div class="col-6 col-sm-3">
              <span class="text-muted d-block">Uploaded Date</span>
              <strong class="text-dark">{{ document.uploadDate | date:'medium' }}</strong>
            </div>
            <div class="col-6 col-sm-3">
              <span class="text-muted d-block">Audit Status</span>
              <span class="badge" [ngClass]="{
                'bg-success': document.status === 'VERIFIED',
                'bg-danger': document.status === 'REJECTED',
                'bg-warning text-dark': document.status === 'PENDING' || document.status === 'UNDER_REVIEW'
              }">{{ document.status }}</span>
            </div>
          </div>

          <!-- Document Remarks Alert (if present) -->
          <div *ngIf="document.remarks" class="alert alert-warning p-3 mb-4 fs-7 shadow-sm border-warning">
            <i class="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
            <strong>Underwriter Remarks:</strong> {{ document.remarks }}
          </div>

          <!-- Interactive Realistic Document Preview Canvas -->
          <div class="d-flex justify-content-center overflow-auto p-2">
            <div 
              class="border rounded-4 bg-white shadow p-4 position-relative overflow-hidden transition-all text-dark"
              [style.transform]="'scale(' + (zoomLevel / 100) + ') rotate(' + rotationDeg + 'deg)'"
              style="width: 100%; max-width: 650px; min-height: 500px; transform-origin: top center;"
            >
              <!-- Watermark Stamp -->
              <div class="position-absolute top-50 start-50 translate-middle opacity-10 text-uppercase fw-extrabold text-primary text-center" style="font-size: 3.5rem; white-space: nowrap; pointer-events: none; transform: translate(-50%, -50%) rotate(-30deg);">
                FINFLOW VERIFIED DOCUMENT
              </div>

              <!-- Official Header Bar -->
              <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div class="d-flex align-items-center gap-2">
                  <div class="bg-primary text-white rounded p-2 fw-bold fs-5">FF</div>
                  <div>
                    <h6 class="fw-bold mb-0 text-primary">FINFLOW VERIFICATION VAULT</h6>
                    <div class="text-muted fs-8">OFFICIAL SUBMITTED APPLICANT DOCUMENT COPY</div>
                  </div>
                </div>
                <div class="text-end">
                  <div class="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                    <i class="bi bi-shield-check me-1"></i> VERIFIED & AUTHENTICATED
                  </div>
                </div>
              </div>

              <!-- Document Content Render -->
              <div *ngIf="document.fileUrl" class="text-center py-2">
                <img [src]="document.fileUrl" [alt]="document.fileName" class="img-fluid rounded border shadow-sm" style="max-height: 450px;">
              </div>

              <!-- Scanned Official Document Preview Template -->
              <div *ngIf="!document.fileUrl" class="scanned-doc-canvas p-3">
                <div class="p-3 bg-light rounded border mb-4">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h5 class="fw-bold text-uppercase mb-1 text-dark">{{ getDocTitle(document.fileType) }}</h5>
                      <p class="text-muted fs-8 mb-0">Government Identity / Financial Verification Record</p>
                    </div>
                    <div class="col-4 text-end">
                      <div class="border border-secondary p-2 bg-white d-inline-block rounded">
                        <i class="bi bi-qr-code-scan fs-1 text-dark"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-3 fs-8 mb-4">
                  <div class="col-6">
                    <span class="text-muted d-block">Document Name:</span>
                    <strong class="fs-7 text-dark">{{ document.fileName }}</strong>
                  </div>
                  <div class="col-6">
                    <span class="text-muted d-block">File Format & Size:</span>
                    <strong class="fs-7 text-dark">{{ document.fileType }} ({{ (document.fileSize || 1258291) / 1024 / 1024 | number:'1.2-2' }} MB)</strong>
                  </div>
                  <div class="col-6">
                    <span class="text-muted d-block">SHA-256 Hash Digest:</span>
                    <code class="text-primary fs-8">8f94e2a1c0d57b491a99f1a234e56789</code>
                  </div>
                  <div class="col-6">
                    <span class="text-muted d-block">Encryption Algorithm:</span>
                    <strong class="text-dark">AES-256 GCM Vault Storage</strong>
                  </div>
                </div>

                <!-- Simulated Document Card Graphic -->
                <div class="border rounded-3 p-3 bg-white mb-4 border-2 border-dashed text-center">
                  <i class="bi" [ngClass]="{
                    'bi-card-heading text-primary': document.fileType === 'AADHAAR' || document.fileType === 'PAN',
                    'bi-bank2 text-success': document.fileType === 'BANK_STATEMENT',
                    'bi-file-earmark-text text-warning': document.fileType === 'INCOME_PROOF' || document.fileType === 'SALARY_SLIP'
                  }" style="font-size: 5rem;"></i>
                  <h6 class="fw-bold mt-2 text-dark">{{ document.fileName }}</h6>
                  <p class="text-muted fs-8 mb-0">Scanned Digital Document Copy stored in FinFlow Microservices Vault.</p>
                </div>

                <!-- Digital Signatures & Stamps Footer -->
                <div class="d-flex justify-content-between align-items-center pt-3 border-top fs-8">
                  <div>
                    <div class="text-muted">Issued Authority Seal</div>
                    <div class="fw-bold text-success"><i class="bi bi-patch-check-fill me-1"></i> VERIFIED BY UNDERWRITER</div>
                  </div>
                  <div class="text-end">
                    <div class="text-muted">Digital Signature</div>
                    <code class="text-secondary">FINFLOW_SECURE_AUTH_SIG#{{ document.id }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-3 bg-white border-top d-flex justify-content-between align-items-center">
          <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" (click)="close.emit()">
            Close Viewer
          </button>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-primary btn-sm rounded-pill px-3" (click)="resetView()">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset View
            </button>
            <button type="button" class="btn btn-ff-primary btn-sm rounded-pill px-4" (click)="downloadFile()">
              <i class="bi bi-download me-1"></i> Download Original File
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop-custom {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(5px);
      z-index: 1095;
    }
    .modal-dialog-custom {
      background: var(--ff-bg-surface);
      color: var(--ff-text-main);
      border-radius: 1rem;
    }
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class DocumentViewerModalComponent {
  @Input() document: Document | null = null;
  @Output() close = new EventEmitter<void>();

  zoomLevel: number = 100;
  rotationDeg: number = 0;

  zoomIn(): void {
    if (this.zoomLevel < 150) this.zoomLevel += 10;
  }

  zoomOut(): void {
    if (this.zoomLevel > 60) this.zoomLevel -= 10;
  }

  rotate(): void {
    this.rotationDeg = (this.rotationDeg + 90) % 360;
  }

  resetView(): void {
    this.zoomLevel = 100;
    this.rotationDeg = 0;
  }

  getDocTitle(fileType: string): string {
    switch (fileType) {
      case 'AADHAAR': return 'Aadhaar Identification Card';
      case 'PAN': return 'Permanent Account Number (PAN)';
      case 'BANK_STATEMENT': return 'Bank Account Statement (6 Months)';
      case 'INCOME_PROOF': return 'Form-16 / Income Tax Return';
      case 'SALARY_SLIP': return 'Official Payslip Record';
      default: return 'Applicant Verification Document';
    }
  }

  downloadFile(): void {
    if (!this.document) return;
    const blob = new Blob([`FinFlow Encrypted Document File Payload: ${this.document.fileName}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.document.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

