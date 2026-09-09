import { Component, Output, EventEmitter, inject, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ChangePasswordModalComponent],
  template: `
    <app-change-password-modal *ngIf="showChangePassModal" (close)="showChangePassModal = false"></app-change-password-modal>

    <header class="navbar navbar-expand-lg border-bottom px-3 py-2 bg-white sticky-top ff-glass shadow-sm">
      <div class="container-fluid p-0">
        <!-- Sidebar Toggle Hamburger (Mobile) -->
        <button class="btn btn-link text-dark d-lg-none me-2 p-0 fs-4" type="button" (click)="toggleSidebar.emit()">
          <i class="bi bi-list"></i>
        </button>

        <!-- Brand Logo -->
        <a class="navbar-brand d-flex align-items-center gap-2 m-0 fw-extrabold text-primary" routerLink="/">
          <div class="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px;">
            <i class="bi bi-bank2 fs-5"></i>
          </div>
          <div>
            <span class="fs-5 tracking-tight">Fin<span class="text-dark">Flow</span></span>
            <span class="d-none d-sm-inline-block badge bg-primary bg-opacity-10 text-primary ms-2 fs-8">MICROSERVICES</span>
          </div>
        </a>

        <!-- Right Action Items -->
        <div class="d-flex align-items-center gap-3 ms-auto">
          <!-- Theme Toggle -->
          <button 
            class="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" 
            style="width: 36px; height: 36px;"
            (click)="themeService.toggleTheme()"
            [title]="'Switch to ' + (themeService.currentTheme() === 'light' ? 'Dark' : 'Light') + ' Mode'"
          >
            <i class="bi" [ngClass]="themeService.currentTheme() === 'light' ? 'bi-moon-stars' : 'bi-sun-fill text-warning'"></i>
          </button>

          <!-- Notifications Dropdown -->
          <div class="dropdown position-relative" #notifDropdown>
            <button 
              class="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center position-relative"
              style="width: 36px; height: 36px;"
              type="button" 
              (click)="toggleNotifications($event)"
            >
              <i class="bi bi-bell-fill"></i>
              <span 
                *ngIf="notificationService.unreadCount() > 0" 
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                style="font-size: 0.65rem;"
              >
                {{ notificationService.unreadCount() }}
              </span>
            </button>
            
            <div 
              class="dropdown-menu dropdown-menu-end shadow-lg p-0 border-0 mt-2 transition-all"
              [class.show]="isNotificationsOpen"
              style="width: 320px; max-height: 420px; overflow-y: auto; right: 0; left: auto;"
            >
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                <h6 class="mb-0 fw-bold">Notifications</h6>
                <button class="btn btn-link btn-xs text-primary p-0 text-decoration-none" (click)="notificationService.markAllAsRead()">Mark all read</button>
              </div>
              <div *ngIf="notificationService.notificationsSignal().length === 0" class="p-4 text-center text-muted">
                <i class="bi bi-bell-slash fs-3 d-block mb-1"></i>
                No new notifications
              </div>
              <div *ngFor="let notif of notificationService.notificationsSignal()" 
                   class="p-3 border-bottom hover-bg-light transition-all cursor-pointer"
                   [class.bg-light]="!notif.read"
                   (click)="notificationService.markAsRead(notif.id)">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-semibold fs-7" [class.text-primary]="!notif.read">{{ notif.title }}</span>
                  <span class="text-muted fs-8">{{ notif.timestamp }}</span>
                </div>
                <p class="text-muted fs-8 mb-0">{{ notif.message }}</p>
              </div>
            </div>
          </div>

          <!-- User Profile Dropdown -->
          <div class="dropdown position-relative" *ngIf="authService.currentUser$ | async as user" #userDropdown>
            <button 
              class="btn btn-light rounded-pill d-flex align-items-center gap-2 p-1 pe-3 border shadow-sm cursor-pointer"
              type="button"
              (click)="toggleUserMenu($event)"
            >
              <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px; font-size: 0.85rem;">
                {{ getUserInitials(user.name) }}
              </div>
              <div class="text-start d-none d-md-block">
                <div class="fw-bold fs-7 leading-none">{{ user.name }}</div>
                <div class="text-muted fs-8 leading-none mt-1">{{ user.role }}</div>
              </div>
              <i class="bi bi-chevron-down fs-8 text-muted ms-1" [class.rotate-180]="isUserMenuOpen"></i>
            </button>

            <ul 
              class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2 transition-all"
              [class.show]="isUserMenuOpen"
              style="min-width: 220px; right: 0; left: auto;"
            >
              <li class="px-3 py-2 border-bottom mb-2 bg-light rounded-2">
                <div class="fw-bold text-dark">{{ user.name }}</div>
                <div class="text-muted fs-8">{{ user.email }}</div>
                <span class="badge bg-success bg-opacity-10 text-success mt-1">{{ user.role }}</span>
              </li>
              <li>
                <a class="dropdown-item d-flex align-items-center gap-2 p-2 rounded text-dark text-decoration-none cursor-pointer" [routerLink]="profileLink" (click)="closeDropdowns()">
                  <i class="bi bi-person-gear text-primary fs-6"></i> My Account Profile
                </a>
              </li>
              <li>
                <button type="button" class="dropdown-item d-flex align-items-center gap-2 p-2 rounded text-dark border-0 bg-transparent w-100 text-start cursor-pointer" (click)="openChangePassword()">
                  <i class="bi bi-shield-lock-fill text-warning fs-6"></i> Change Password
                </button>
              </li>
              <li>
                <a class="dropdown-item d-flex align-items-center gap-2 p-2 rounded text-dark text-decoration-none cursor-pointer" [routerLink]="notificationsLink" (click)="closeDropdowns()">
                  <i class="bi bi-bell text-info fs-6"></i> View Notifications
                </a>
              </li>
              <li><hr class="dropdown-divider my-2"></li>
              <li>
                <button class="dropdown-item d-flex align-items-center gap-2 p-2 rounded text-danger w-100 border-0 bg-transparent cursor-pointer" (click)="onLogout()">
                  <i class="bi bi-box-arrow-right fs-6"></i> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
    .leading-none { line-height: 1; }
    .cursor-pointer { cursor: pointer; }
    .dropdown-item:hover {
      background-color: rgba(37, 99, 235, 0.08);
    }
    .rotate-180 {
      transform: rotate(180deg);
      transition: transform 0.2s ease;
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);
  toastService = inject(ToastService);
  router = inject(Router);
  elementRef = inject(ElementRef);

  isNotificationsOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  showChangePassModal: boolean = false;

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isNotificationsOpen = false;
  }

  openChangePassword(): void {
    this.closeDropdowns();
    this.showChangePassModal = true;
  }

  closeDropdowns(): void {
    this.isNotificationsOpen = false;
    this.isUserMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdowns();
    }
  }

  getUserInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  get profileLink(): string {
    return this.authService.isAdmin() ? '/admin/profile' : '/applicant/profile';
  }

  get notificationsLink(): string {
    return this.authService.isAdmin() ? '/admin/notifications' : '/applicant/notifications';
  }

  onLogout(): void {
    this.closeDropdowns();
    this.authService.logout();
    this.toastService.info('You have logged out successfully.');
    this.router.navigate(['/login']);
  }
}

