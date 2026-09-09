import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SupportAssistanceModalComponent } from '../support-assistance-modal/support-assistance-modal.component';

export interface NavItem {
  label: string;
  link: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SupportAssistanceModalComponent],
  template: `
    <app-support-assistance-modal *ngIf="showSupportModal" (close)="showSupportModal = false"></app-support-assistance-modal>

    <div class="ff-sidebar h-100 d-flex flex-column bg-white border-end p-3 shadow-sm">
      <!-- Role Header Pill -->
      <div class="mb-4 px-2 py-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-20 d-flex align-items-center gap-3">
        <div class="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          <i class="bi" [ngClass]="isAdmin ? 'bi-shield-lock-fill' : 'bi-person-vcard-fill'"></i>
        </div>
        <div>
          <div class="text-uppercase text-muted fs-8 fw-bold tracking-wider">Portal</div>
          <div class="fw-extrabold text-primary fs-7">{{ isAdmin ? 'Admin Underwriter' : 'Applicant Portal' }}</div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="nav nav-pills flex-column gap-1 flex-grow-1">
        <a 
          *ngFor="let item of navItems" 
          [routerLink]="item.link" 
          routerLinkActive="active"
          class="nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-semibold text-secondary transition-all"
        >
          <i class="bi fs-5" [ngClass]="item.icon"></i>
          <span>{{ item.label }}</span>
          <span *ngIf="item.badge" class="badge ms-auto" [ngClass]="item.badgeClass || 'bg-primary'">{{ item.badge }}</span>
        </a>
      </nav>

      <!-- Quick Action Card / Logout Footer -->
      <div class="mt-auto pt-3 border-top">
        <div *ngIf="!isAdmin" class="p-3 bg-light rounded-3 mb-3 text-center border">
          <i class="bi bi-headset fs-3 text-primary d-block mb-1"></i>
          <h6 class="fw-bold fs-7 mb-1">Need Loan Guidance?</h6>
          <p class="text-muted fs-8 mb-2">Speak to our financial experts</p>
          <button type="button" class="btn btn-ff-primary btn-sm w-100" (click)="showSupportModal = true">
            <i class="bi bi-person-lines-fill me-1"></i> Get Assistance
          </button>
        </div>

        <button class="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2" (click)="onLogout()">
          <i class="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ff-sidebar {
      width: 260px;
      min-height: calc(100vh - 60px);
    }
    .nav-link {
      color: var(--ff-text-muted);
    }
    .nav-link:hover {
      background-color: var(--ff-primary-light);
      color: var(--ff-primary);
    }
    .nav-link.active {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
    .tracking-wider { letter-spacing: 0.05em; }
  `]
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() isAdmin: boolean = false;

  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  navItems: NavItem[] = [];
  showSupportModal: boolean = false;

  ngOnInit(): void {
    this.updateNavItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isAdmin']) {
      this.updateNavItems();
    }
  }

  private updateNavItems(): void {
    if (this.isAdmin) {
      this.navItems = [
        { label: 'Dashboard', link: '/admin/dashboard', icon: 'bi-grid-1x2-fill' },
        { label: 'Loan Applications', link: '/admin/applications', icon: 'bi-file-earmark-text-fill' },
        { label: 'User Directory', link: '/admin/users', icon: 'bi-people-fill' },
        { label: 'Document Audit', link: '/admin/documents', icon: 'bi-folder-check' },
        { label: 'System Reports', link: '/admin/reports', icon: 'bi-bar-chart-line-fill' },
        { label: 'Notifications', link: '/admin/notifications', icon: 'bi-bell-fill' },
        { label: 'My Profile', link: '/admin/profile', icon: 'bi-person-circle' }
      ];
    } else {
      this.navItems = [
        { label: 'Dashboard', link: '/applicant/dashboard', icon: 'bi-speedometer2' },
        { label: 'Apply For Loan', link: '/applicant/apply-loan', icon: 'bi-plus-circle-fill', badge: 'New', badgeClass: 'bg-success' },
        { label: 'My Applications', link: '/applicant/applications', icon: 'bi-collection-fill' },
        { label: 'My Documents', link: '/applicant/documents', icon: 'bi-cloud-arrow-up-fill' },
        { label: 'Notifications', link: '/applicant/notifications', icon: 'bi-bell-fill' },
        { label: 'My Profile', link: '/applicant/profile', icon: 'bi-person-fill-gear' }
      ];
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.toastService.info('You have logged out.');
    this.router.navigate(['/login']);
  }
}
