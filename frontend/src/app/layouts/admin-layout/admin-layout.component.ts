import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent, ToastContainerComponent],
  template: `
    <app-toast-container></app-toast-container>
    
    <div class="d-flex flex-column min-vh-100">
      <app-header (toggleSidebar)="mobileSidebarOpen = !mobileSidebarOpen"></app-header>

      <div class="d-flex flex-grow-1 position-relative">
        <!-- Desktop Admin Sidebar -->
        <div class="d-none d-lg-block">
          <app-sidebar [isAdmin]="true"></app-sidebar>
        </div>

        <!-- Mobile Drawer Overlay -->
        <div *ngIf="mobileSidebarOpen" class="mobile-drawer-overlay d-lg-none" (click)="mobileSidebarOpen = false">
          <div class="mobile-drawer-content" (click)="$event.stopPropagation()">
            <app-sidebar [isAdmin]="true"></app-sidebar>
          </div>
        </div>

        <!-- Main Content Area -->
        <main class="flex-grow-1 p-3 p-md-4 p-xl-5 bg-light overflow-x-hidden">
          <div class="container-fluid p-0">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .mobile-drawer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1080;
    }
    .mobile-drawer-content {
      width: 260px;
      height: 100%;
      background: white;
    }
  `]
})
export class AdminLayoutComponent {
  mobileSidebarOpen: boolean = false;
}
