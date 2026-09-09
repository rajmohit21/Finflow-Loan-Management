import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer mt-auto py-3 bg-white border-top text-muted text-center fs-8">
      <div class="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div>
          &copy; 2026 <strong>FinFlow Loan Management System</strong>. All rights reserved.
        </div>
        <div class="d-flex align-items-center gap-3 mt-2 mt-md-0">
          <span class="badge bg-success bg-opacity-10 text-success"><i class="bi bi-circle-fill fs-9 me-1"></i> API Gateway 8090 Online</span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .fs-8 { font-size: 0.75rem; }
    .fs-9 { font-size: 0.5rem; }
  `]
})
export class FooterComponent {}
