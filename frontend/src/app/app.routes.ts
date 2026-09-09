import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ApplicantLayoutComponent } from './layouts/applicant-layout/applicant-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public Authentication Routes
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  },

  // Protected Applicant Routes
  {
    path: 'applicant',
    component: ApplicantLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['APPLICANT', 'USER'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/applicant/applicant-dashboard/applicant-dashboard.component').then(m => m.ApplicantDashboardComponent)
      },
      {
        path: 'apply-loan',
        loadComponent: () => import('./features/applicant/apply-loan/apply-loan.component').then(m => m.ApplyLoanComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/applicant/applicant-applications/applicant-applications.component').then(m => m.ApplicantApplicationsComponent)
      },
      {
        path: 'applications/:id',
        loadComponent: () => import('./features/applicant/application-detail/application-detail.component').then(m => m.ApplicationDetailComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/applicant/applicant-documents/applicant-documents.component').then(m => m.ApplicantDocumentsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/applicant/applicant-notifications/applicant-notifications.component').then(m => m.ApplicantNotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/applicant/applicant-profile/applicant-profile.component').then(m => m.ApplicantProfileComponent)
      }
    ]
  },

  // Protected Admin Underwriter Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/admin/admin-applications/admin-applications.component').then(m => m.AdminApplicationsComponent)
      },
      {
        path: 'applications/:id',
        loadComponent: () => import('./features/admin/admin-application-review/admin-application-review.component').then(m => m.AdminApplicationReviewComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/admin/admin-documents/admin-documents.component').then(m => m.AdminDocumentsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/admin/admin-notifications/admin-notifications.component').then(m => m.AdminNotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/admin/admin-profile/admin-profile.component').then(m => m.AdminProfileComponent)
      }
    ]
  },

  // Error Pages
  {
    path: '404',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: 'error',
    loadComponent: () => import('./features/errors/error/error.component').then(m => m.ErrorComponent)
  },
  { path: '**', redirectTo: '404' }
];
