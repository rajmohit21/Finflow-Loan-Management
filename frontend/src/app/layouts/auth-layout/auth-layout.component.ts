import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent],
  template: `
    <app-toast-container></app-toast-container>

    <div class="container-fluid p-0 min-vh-100 d-flex flex-column flex-lg-row bg-light">
      <!-- Left Hero Banner -->
      <div class="col-lg-6 bg-primary text-white p-5 d-flex flex-column justify-content-between position-relative overflow-hidden">
        <!-- Background Decorative Shapes -->
        <div class="position-absolute rounded-circle bg-white bg-opacity-10" style="width: 400px; height: 400px; top: -100px; left: -100px; filter: blur(50px);"></div>
        <div class="position-absolute rounded-circle bg-warning bg-opacity-20" style="width: 300px; height: 300px; bottom: -50px; right: -50px; filter: blur(40px);"></div>

        <div class="position-relative z-1">
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="bg-white text-primary rounded-3 p-2 d-flex align-items-center justify-content-center shadow-lg" style="width: 48px; height: 48px;">
              <i class="bi bi-bank2 fs-3"></i>
            </div>
            <div>
              <h3 class="fw-extrabold mb-0 text-white tracking-tight">FinFlow</h3>
              <span class="fs-8 text-white-50">Next-Gen Loan Management System</span>
            </div>
          </div>
        </div>

        <div class="my-auto py-5 position-relative z-1">
          <span class="badge bg-white bg-opacity-20 text-white mb-3 px-3 py-2 fw-semibold">SPRING BOOT MICROSERVICES BACKEND</span>
          <h1 class="display-5 fw-extrabold text-white mb-3">Empowering Financial Freedom with Instant Approvals</h1>
          <p class="fs-5 text-white-50 mb-4" style="max-width: 540px;">
            Streamlined digital loan application, intelligent risk calculations, real-time status tracking, and document verification.
          </p>

          <div class="row g-3 mt-4">
            <div class="col-sm-4">
              <div class="p-3 rounded-3 bg-white bg-opacity-10 backdrop-blur">
                <i class="bi bi-lightning-charge-fill text-warning fs-3 mb-2 d-block"></i>
                <h6 class="fw-bold mb-1">Instant Rate</h6>
                <p class="fs-8 text-white-50 mb-0">Dynamic risk calculation</p>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="p-3 rounded-3 bg-white bg-opacity-10 backdrop-blur">
                <i class="bi bi-shield-lock-fill text-info fs-3 mb-2 d-block"></i>
                <h6 class="fw-bold mb-1">JWT Secured</h6>
                <p class="fs-8 text-white-50 mb-0">Stateless microservices</p>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="p-3 rounded-3 bg-white bg-opacity-10 backdrop-blur">
                <i class="bi bi-file-earmark-check-fill text-success fs-3 mb-2 d-block"></i>
                <h6 class="fw-bold mb-1">Paperless</h6>
                <p class="fs-8 text-white-50 mb-0">Digital file review</p>
              </div>
            </div>
          </div>
        </div>

        <div class="position-relative z-1 text-white-50 fs-8 d-flex justify-content-between border-top border-white border-opacity-20 pt-3">
          <span>&copy; 2026 FinFlow Loan System</span>
          <span>API Gateway :8090</span>
        </div>
      </div>

      <!-- Right Auth Form Screen -->
      <div class="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
        <div class="w-100" style="max-width: 460px;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-8 { font-size: 0.75rem; }
    .backdrop-blur { backdrop-filter: blur(10px); }
  `]
})
export class AuthLayoutComponent {}
