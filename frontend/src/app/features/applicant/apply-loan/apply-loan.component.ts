import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { DocumentService } from '../../../core/services/document.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmiCalculatorComponent } from '../../../shared/components/emi-calculator/emi-calculator.component';
import { FileDropDirective } from '../../../shared/directives/file-drop.directive';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { LoanType } from '../../../core/models/application.model';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, EmiCalculatorComponent, FileDropDirective, CurrencyFormatPipe],
  template: `
    <div class="animate-fade-in" style="max-width: 1000px; margin: 0 auto;">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-extrabold mb-1">Digital Loan Application Wizard</h3>
          <p class="text-muted fs-7 mb-0">Complete the 6 simple steps to submit your credit evaluation request</p>
        </div>
        <a routerLink="/applicant/dashboard" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-x-lg me-1"></i> Cancel Application
        </a>
      </div>

      <!-- 6-Step Stepper Header -->
      <div class="ff-card p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center position-relative">
          <div *ngFor="let s of stepTitles; let i = index" class="text-center position-relative z-1">
            <div 
              class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 fw-bold transition-all"
              [ngClass]="{
                'bg-success text-white': currentStep > i + 1,
                'bg-primary text-white shadow-lg': currentStep === i + 1,
                'bg-light text-muted border': currentStep < i + 1
              }"
              style="width: 40px; height: 40px; font-size: 0.95rem;"
            >
              <i *ngIf="currentStep > i + 1" class="bi bi-check-lg"></i>
              <span *ngIf="currentStep <= i + 1">{{ i + 1 }}</span>
            </div>
            <div class="fs-8 fw-semibold text-muted d-none d-md-block" [class.text-primary]="currentStep === i + 1">
              {{ s }}
            </div>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="ff-card p-4 p-md-5">
        <form [formGroup]="loanForm">
          
          <!-- STEP 1: PERSONAL INFORMATION -->
          <div *ngIf="currentStep === 1" class="animate-fade-in">
            <h5 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i class="bi bi-person-lines-fill"></i> Step 1: Personal Information
            </h5>

            <div class="row g-3" formGroupName="personal">
              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Full Name (as per Aadhaar / PAN)</label>
                <input type="text" class="form-control" formControlName="fullName" placeholder="e.g. Mohit Raj" [class.is-invalid]="pf['fullName'].touched && pf['fullName'].errors" />
                <div *ngIf="pf['fullName'].touched && pf['fullName'].errors" class="text-danger fs-8 mt-1">Full name is required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Date of Birth</label>
                <input type="date" class="form-control" formControlName="dob" placeholder="YYYY-MM-DD" [class.is-invalid]="pf['dob'].touched && pf['dob'].errors" />
                <div *ngIf="pf['dob'].touched && pf['dob'].errors" class="text-danger fs-8 mt-1">Valid date of birth required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Email Address</label>
                <input type="email" class="form-control" formControlName="email" placeholder="e.g. mohit.raj@example.com" [class.is-invalid]="pf['email'].touched && pf['email'].errors" />
                <div *ngIf="pf['email'].touched && pf['email'].errors" class="text-danger fs-8 mt-1">Valid email required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Phone Number</label>
                <input type="tel" class="form-control" formControlName="phone" placeholder="e.g. 9876543210" [class.is-invalid]="pf['phone'].touched && pf['phone'].errors" />
                <div *ngIf="pf['phone'].touched && pf['phone'].errors" class="text-danger fs-8 mt-1">10-digit phone required.</div>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold fs-7 text-muted">Current Address</label>
                <textarea class="form-control" rows="2" formControlName="address" placeholder="e.g. Flat 501, Blue Ridge Towers, Andheri West" [class.is-invalid]="pf['address'].touched && pf['address'].errors"></textarea>
                <div *ngIf="pf['address'].touched && pf['address'].errors" class="text-danger fs-8 mt-1">Address is required.</div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold fs-7 text-muted">City</label>
                <input type="text" class="form-control" formControlName="city" placeholder="e.g. Mumbai" />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold fs-7 text-muted">State</label>
                <input type="text" class="form-control" formControlName="state" placeholder="e.g. Maharashtra" />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold fs-7 text-muted">Pincode</label>
                <input type="text" class="form-control" formControlName="pincode" placeholder="e.g. 400053" [class.is-invalid]="pf['pincode'].touched && pf['pincode'].errors" />
                <div *ngIf="pf['pincode'].touched && pf['pincode'].errors" class="text-danger fs-8 mt-1">6-digit pincode required.</div>
              </div>
            </div>
          </div>

          <!-- STEP 2: EMPLOYMENT INFORMATION -->
          <div *ngIf="currentStep === 2" class="animate-fade-in">
            <h5 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i class="bi bi-briefcase-fill"></i> Step 2: Employment Details
            </h5>

            <div class="row g-3" formGroupName="employment">
              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Employment Type</label>
                <select class="form-select" formControlName="employmentType">
                  <option value="Salaried">Salaried (Private / Govt)</option>
                  <option value="Self-Employed">Self-Employed Professional</option>
                  <option value="Business">Business Owner / Partner</option>
                  <option value="Freelancer">Freelancer / Independent Contractor</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Employer / Business Name</label>
                <input type="text" class="form-control" formControlName="employerName" placeholder="e.g. Capgemini India Ltd" [class.is-invalid]="ef['employerName'].touched && ef['employerName'].errors" />
                <div *ngIf="ef['employerName'].touched && ef['employerName'].errors" class="text-danger fs-8 mt-1">Employer name is required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Job Title / Designation</label>
                <input type="text" class="form-control" formControlName="jobTitle" placeholder="e.g. Lead Software Architect" [class.is-invalid]="ef['jobTitle'].touched && ef['jobTitle'].errors" />
                <div *ngIf="ef['jobTitle'].touched && ef['jobTitle'].errors" class="text-danger fs-8 mt-1">Job title is required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Work Experience (Years)</label>
                <input type="number" class="form-control" formControlName="workExperienceYears" placeholder="e.g. 5" min="0" />
              </div>
            </div>
          </div>

          <!-- STEP 3: FINANCIAL DETAILS & ELIGIBILITY -->
          <div *ngIf="currentStep === 3" class="animate-fade-in">
            <h5 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i class="bi bi-currency-rupee"></i> Step 3: Financial Income & DTI Assessment
            </h5>

            <div class="row g-3" formGroupName="financial">
              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Gross Monthly Income (₹)</label>
                <input type="number" class="form-control" formControlName="monthlyIncome" placeholder="e.g. 150000" (input)="calculateDti()" [class.is-invalid]="ff['monthlyIncome'].touched && ff['monthlyIncome'].errors" />
                <div *ngIf="ff['monthlyIncome'].touched && ff['monthlyIncome'].errors" class="text-danger fs-8 mt-1">Monthly income required.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Existing Monthly EMIs (₹)</label>
                <input type="number" class="form-control" formControlName="existingEmi" placeholder="e.g. 15000" (input)="calculateDti()" />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Estimated Credit Score (CIBIL)</label>
                <input type="number" class="form-control" formControlName="creditScore" placeholder="e.g. 780" min="300" max="900" />
                <span class="fs-8 text-muted">Standard range: 300 - 900</span>
              </div>

              <!-- DTI Assessment Indicator Box -->
              <div class="col-12 mt-4">
                <div class="p-4 rounded-3 border" [ngClass]="dtiScore <= 50 ? 'bg-success bg-opacity-10 border-success' : 'bg-warning bg-opacity-10 border-warning'">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-dark fs-7">Debt-to-Income (DTI) Ratio:</span>
                    <span class="badge fs-7 px-3 py-1" [ngClass]="dtiScore <= 50 ? 'bg-success' : 'bg-warning text-dark'">
                      {{ dtiScore | number:'1.1-1' }}%
                    </span>
                  </div>
                  <div class="progress mb-2" style="height: 8px;">
                    <div class="progress-bar" [ngClass]="dtiScore <= 50 ? 'bg-success' : 'bg-warning'" [style.width.%]="dtiScore"></div>
                  </div>
                  <p class="fs-8 text-muted mb-0">
                    <i class="bi bi-info-circle-fill me-1"></i>
                    {{ dtiScore <= 50 ? 'Excellent DTI! High approval probability.' : 'High debt obligations relative to income. Additional collateral or guarantor may be requested.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 4: LOAN INFORMATION & CALCULATOR -->
          <div *ngIf="currentStep === 4" class="animate-fade-in">
            <h5 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i class="bi bi-bank"></i> Step 4: Loan Specifications & EMI Preview
            </h5>

            <div class="row g-3 mb-4" formGroupName="loanDetails">
              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Loan Category / Type</label>
                <select class="form-select" formControlName="loanType" (change)="onLoanTypeChange()">
                  <option value="PERSONAL">Personal Loan (10.5% p.a.)</option>
                  <option value="HOME">Home Loan (8.0% p.a.)</option>
                  <option value="EDUCATION">Education Loan (6.5% p.a.)</option>
                  <option value="VEHICLE">Vehicle / Auto Loan (9.0% p.a.)</option>
                  <option value="BUSINESS">Business Expansion Loan (12.0% p.a.)</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Requested Amount (₹)</label>
                <input type="number" class="form-control" formControlName="loanAmount" placeholder="e.g. 500000" step="10000" (input)="onLoanAmountChange()" />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Tenure (Months)</label>
                <select class="form-select" formControlName="loanTermMonths">
                  <option [value]="12">12 Months (1 Year)</option>
                  <option [value]="24">24 Months (2 Years)</option>
                  <option [value]="36">36 Months (3 Years)</option>
                  <option [value]="60">60 Months (5 Years)</option>
                  <option [value]="120">120 Months (10 Years)</option>
                  <option [value]="240">240 Months (20 Years)</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-muted">Estimated Interest Rate</label>
                <input type="text" class="form-control bg-light fw-bold text-success" [value]="estimatedInterestRate + '% p.a.'" readonly />
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold fs-7 text-muted">Loan Purpose / Reason</label>
                <input type="text" class="form-control" formControlName="loanPurpose" placeholder="e.g. Apartment purchase in Baner, Higher studies, Business expansion" />
              </div>
            </div>

            <!-- Embedded Interactive EMI Calculator -->
            <app-emi-calculator 
              [amount]="lf['loanAmount'].value" 
              [interestRate]="estimatedInterestRate" 
              [tenureMonths]="lf['loanTermMonths'].value"
            ></app-emi-calculator>
          </div>

          <!-- STEP 5: DOCUMENT UPLOAD -->
          <div *ngIf="currentStep === 5" class="animate-fade-in">
            <h5 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i class="bi bi-cloud-arrow-up-fill"></i> Step 5: Required Document Uploads
            </h5>

            <div class="alert alert-info border-0 shadow-sm mb-4">
              <i class="bi bi-info-circle-fill me-2"></i> Accepted formats: PDF, JPG, PNG (Max 5MB per file).
            </div>

            <div class="upload-dragzone mb-4" appFileDrop (fileDropped)="onFileDropped($event)">
              <i class="bi bi-cloud-upload display-4 text-primary d-block mb-2"></i>
              <h6 class="fw-bold mb-1">Drag & Drop Documents Here</h6>
              <p class="text-muted fs-8 mb-3">or click the button below to browse local files</p>
              <input type="file" #fileInput class="d-none" multiple (change)="onFileSelect($event)" accept=".pdf,.jpg,.jpeg,.png">
              <button type="button" class="btn btn-outline-primary btn-sm px-4 fw-semibold" (click)="fileInput.click()">
                <i class="bi bi-folder-plus me-1"></i> Browse Files
              </button>
            </div>

            <!-- Uploaded Files List Table -->
            <div *ngIf="stagedFiles.length > 0" class="table-responsive border rounded-3 p-3">
              <h6 class="fw-bold mb-2 fs-7 text-muted">Staged Documents ({{ stagedFiles.length }})</h6>
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr class="fs-8 text-muted text-uppercase">
                    <th>Document Category</th>
                    <th>File Name</th>
                    <th>Size</th>
                    <th class="text-end">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of stagedFiles; let idx = index">
                    <td>
                      <select class="form-select form-select-sm" [(ngModel)]="item.fileType" [ngModelOptions]="{standalone: true}">
                        <option value="AADHAAR">Aadhaar Card</option>
                        <option value="PAN_CARD">PAN Card</option>
                        <option value="SALARY_SLIP">Salary Slip / Income Proof</option>
                        <option value="BANK_STATEMENT">Bank Statement 6M</option>
                      </select>
                    </td>
                    <td class="fw-semibold text-dark fs-7">
                      <i class="bi bi-file-earmark-pdf-fill text-danger me-1"></i> {{ item.file.name }}
                    </td>
                    <td class="text-muted fs-8">{{ (item.file.size / 1024 / 1024) | number:'1.2-2' }} MB</td>
                    <td class="text-end">
                      <button type="button" class="btn btn-outline-danger btn-sm p-1" (click)="removeStagedFile(idx)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- STEP 6: REVIEW & SUBMIT -->
          <div *ngIf="currentStep === 6" class="animate-fade-in">
            <h5 class="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill"></i> Step 6: Review & Final Submission
            </h5>

            <div class="row g-4">
              <!-- Summary Column 1 -->
              <div class="col-md-6">
                <div class="p-3 bg-light rounded-3 border">
                  <h6 class="fw-bold text-primary border-bottom pb-2 fs-7">Personal Details</h6>
                  <div class="fs-8 mb-1"><strong>Name:</strong> {{ pf['fullName'].value }}</div>
                  <div class="fs-8 mb-1"><strong>Email:</strong> {{ pf['email'].value }}</div>
                  <div class="fs-8 mb-1"><strong>Phone:</strong> {{ pf['phone'].value }}</div>
                  <div class="fs-8"><strong>Address:</strong> {{ pf['address'].value }}, {{ pf['city'].value }}</div>
                </div>
              </div>

              <!-- Summary Column 2 -->
              <div class="col-md-6">
                <div class="p-3 bg-light rounded-3 border">
                  <h6 class="fw-bold text-primary border-bottom pb-2 fs-7">Employment & Financials</h6>
                  <div class="fs-8 mb-1"><strong>Employer:</strong> {{ ef['employerName'].value }} ({{ ef['employmentType'].value }})</div>
                  <div class="fs-8 mb-1"><strong>Monthly Income:</strong> {{ ff['monthlyIncome'].value | currencyFormat }}</div>
                  <div class="fs-8 mb-1"><strong>DTI Ratio:</strong> {{ dtiScore | number:'1.1-1' }}%</div>
                  <div class="fs-8"><strong>Credit Score:</strong> {{ ff['creditScore'].value }}</div>
                </div>
              </div>

              <!-- Summary Column 3 -->
              <div class="col-12">
                <div class="p-4 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="badge bg-primary text-white mb-1">{{ lf['loanType'].value }} LOAN</span>
                      <h4 class="fw-extrabold text-primary mb-0">{{ lf['loanAmount'].value | currencyFormat }}</h4>
                    </div>
                    <div class="text-end">
                      <div class="fs-7 fw-bold text-dark">{{ lf['loanTermMonths'].value }} Months Tenure</div>
                      <div class="fs-8 text-success fw-bold">{{ estimatedInterestRate }}% Interest Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Confirmation check -->
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="confirmSubmit" [(ngModel)]="agreedTerms" [ngModelOptions]="{standalone: true}">
                  <label class="form-check-label fs-8 text-muted" for="confirmSubmit">
                    I declare that the information provided is accurate and grant permission to FinFlow to perform credit evaluation checks.
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Wizard Navigation Footer Buttons -->
          <div class="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
            <button 
              type="button" 
              class="btn btn-outline-secondary px-4 fw-semibold" 
              (click)="prevStep()"
              [disabled]="currentStep === 1"
            >
              <i class="bi bi-arrow-left me-1"></i> Back
            </button>

            <button 
              *ngIf="currentStep < 6" 
              type="button" 
              class="btn btn-ff-primary px-4 fw-bold" 
              (click)="nextStep()"
            >
              Next Step <i class="bi bi-arrow-right ms-1"></i>
            </button>

            <button 
              *ngIf="currentStep === 6" 
              type="button" 
              class="btn btn-success btn-lg px-5 fw-extrabold shadow" 
              (click)="submitWizard()"
              [disabled]="submitting || !agreedTerms"
            >
              <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <span>{{ submitting ? 'Submitting Application...' : 'Submit Loan Application' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.85rem; }
    .fs-8 { font-size: 0.75rem; }
  `]
})
export class ApplyLoanComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  applicationService = inject(ApplicationService);
  documentService = inject(DocumentService);
  toastService = inject(ToastService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  currentStep: number = 1;
  stepTitles: string[] = ['Personal', 'Employment', 'Financial', 'Loan & EMI', 'Documents', 'Review'];
  
  loanForm!: FormGroup;
  stagedFiles: { file: File; fileType: string }[] = [];
  dtiScore: number = 25;
  estimatedInterestRate: number = 10.5;

  agreedTerms: boolean = false;
  submitting: boolean = false;

  ngOnInit(): void {
    const user = this.authService.currentUserValue;

    this.loanForm = this.fb.group({
      personal: this.fb.group({
        fullName: [user?.name || '', Validators.required],
        dob: ['', Validators.required],
        email: [user?.email || '', [Validators.required, Validators.email]],
        phone: [user?.phone && user.phone !== '9876543210' ? user.phone : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        address: [user?.address && !user.address.includes('42 Financial Park') ? user.address : '', Validators.required],
        city: [user?.city && user.city !== 'Mumbai' ? user.city : ''],
        state: [user?.state && user.state !== 'Maharashtra' ? user.state : ''],
        pincode: [user?.pincode && user.pincode !== '400001' ? user.pincode : '', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      }),
      employment: this.fb.group({
        employmentType: ['Salaried', Validators.required],
        employerName: ['', Validators.required],
        jobTitle: ['', Validators.required],
        workExperienceYears: [null]
      }),
      financial: this.fb.group({
        monthlyIncome: [null, [Validators.required, Validators.min(10000)]],
        existingEmi: [null],
        creditScore: [750]
      }),
      loanDetails: this.fb.group({
        loanType: ['PERSONAL' as LoanType, Validators.required],
        loanAmount: [null, [Validators.required, Validators.min(25000)]],
        loanTermMonths: [36, Validators.required],
        loanPurpose: ['', Validators.required]
      })
    });

    this.calculateDti();
    this.onLoanTypeChange();
  }

  get pf() { return (this.loanForm.get('personal') as FormGroup).controls; }
  get ef() { return (this.loanForm.get('employment') as FormGroup).controls; }
  get ff() { return (this.loanForm.get('financial') as FormGroup).controls; }
  get lf() { return (this.loanForm.get('loanDetails') as FormGroup).controls; }

  calculateDti(): void {
    const income = this.ff['monthlyIncome'].value || 1;
    const emi = this.ff['existingEmi'].value || 0;
    this.dtiScore = (emi / income) * 100;
  }

  onLoanTypeChange(): void {
    const type = this.lf['loanType'].value;
    const amount = this.lf['loanAmount'].value || 500000;
    this.estimatedInterestRate = this.applicationService.calculateLocalRate(amount, type);
  }

  onLoanAmountChange(): void {
    this.onLoanTypeChange();
  }

  nextStep(): void {
    if (this.currentStep === 1 && (this.loanForm.get('personal') as FormGroup).invalid) {
      (this.loanForm.get('personal') as FormGroup).markAllAsTouched();
      this.toastService.warning('Please fill all required personal details correctly.');
      return;
    }
    if (this.currentStep === 2 && (this.loanForm.get('employment') as FormGroup).invalid) {
      (this.loanForm.get('employment') as FormGroup).markAllAsTouched();
      this.toastService.warning('Please fill employment details.');
      return;
    }
    if (this.currentStep === 3 && (this.loanForm.get('financial') as FormGroup).invalid) {
      (this.loanForm.get('financial') as FormGroup).markAllAsTouched();
      this.toastService.warning('Please enter valid monthly income.');
      return;
    }

    if (this.currentStep < 6) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileDropped(files: any): void {
    const list: FileList = files as FileList;
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        this.stagedFiles.push({
          file: list[i],
          fileType: 'SALARY_SLIP'
        });
      }
      this.toastService.info(`${list.length} document(s) added.`);
    }
  }

  onFileSelect(event: any): void {
    const files: FileList = event.target.files;
    if (files) this.onFileDropped(files);
  }

  removeStagedFile(index: number): void {
    this.stagedFiles.splice(index, 1);
  }

  submitWizard(): void {
    if (!this.agreedTerms) return;

    this.submitting = true;
    const user = this.authService.currentUserValue;

    const p = this.pf;
    const e = this.ef;
    const f = this.ff;
    const l = this.lf;

    const req = {
      fullName: p['fullName'].value,
      email: p['email'].value,
      phone: p['phone'].value,
      address: p['address'].value,
      city: p['city'].value,
      state: p['state'].value,
      pincode: p['pincode'].value,
      employerName: e['employerName'].value,
      jobTitle: e['jobTitle'].value,
      employmentType: e['employmentType'].value,
      annualIncome: f['monthlyIncome'].value * 12,
      monthlyIncome: f['monthlyIncome'].value,
      existingEmi: f['existingEmi'].value,
      creditScore: f['creditScore'].value,
      loanAmount: l['loanAmount'].value,
      loanPurpose: l['loanPurpose'].value,
      loanType: l['loanType'].value,
      loanTermMonths: l['loanTermMonths'].value,
      userId: user?.id || 1
    };

    this.applicationService.createApplication(req).subscribe({
      next: (createdApp) => {
        // Automatically trigger submit endpoint
        this.applicationService.submitApplication(createdApp.id).subscribe({
          next: () => {
            // Upload staged files if any
            this.stagedFiles.forEach(item => {
              this.documentService.uploadDocument(createdApp.id, item.fileType, item.file).subscribe();
            });

            this.submitting = false;
            this.notificationService.addNotification({
              title: 'Application Submitted!',
              message: `Your ${createdApp.loanType} loan application #${createdApp.id} for ₹${createdApp.loanAmount} has been submitted.`,
              type: 'success',
              applicationId: createdApp.id
            });
            this.toastService.success(`Application #${createdApp.id} submitted successfully!`);
            this.router.navigate(['/applicant/applications', createdApp.id]);
          },
          error: () => {
            this.submitting = false;
            this.router.navigate(['/applicant/applications', createdApp.id]);
          }
        });
      },
      error: () => {
        this.submitting = false;
        this.toastService.error('Failed to submit application. Please try again.');
      }
    });
  }
}
