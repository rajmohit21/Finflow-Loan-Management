import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoanApplication, ApplicationRequest, ApplicationStatus } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  private mockApplications: LoanApplication[] = [
    {
      id: 101,
      userId: 1,
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      address: 'Flat 402, Apex Heights, Andheri West',
      employerName: 'TechCorp Solutions India',
      jobTitle: 'Senior Software Engineer',
      employmentType: 'Salaried',
      annualIncome: 1400000,
      monthlyIncome: 116666,
      existingEmi: 15000,
      creditScore: 780,
      loanAmount: 500000,
      loanPurpose: 'Personal Expense',
      loanType: 'PERSONAL',
      loanTermMonths: 36,
      interestRate: 10.5,
      status: 'UNDER_REVIEW',
      createdDate: '2026-03-01T10:00:00Z',
      submittedDate: '2026-03-01T10:30:00Z',
      remarks: 'Salary slips and IT returns attached for underwriter verification.'
    },
    {
      id: 102,
      userId: 1,
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      address: 'Flat 402, Apex Heights, Andheri West',
      employerName: 'TechCorp Solutions India',
      jobTitle: 'Senior Software Engineer',
      employmentType: 'Salaried',
      annualIncome: 1400000,
      monthlyIncome: 116666,
      existingEmi: 0,
      creditScore: 810,
      loanAmount: 4500000,
      loanPurpose: 'Home Purchase',
      loanType: 'HOME',
      loanTermMonths: 240,
      interestRate: 8.0,
      status: 'APPROVED',
      createdDate: '2026-02-10T14:20:00Z',
      submittedDate: '2026-02-10T15:00:00Z',
      remarks: 'Application pre-approved based on excellent credit score and verified employment.'
    },
    {
      id: 103,
      userId: 2,
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '9820112233',
      address: 'B-12 Greenwood Residency, Whitefield',
      employerName: 'InnoTech Systems',
      jobTitle: 'Product Manager',
      employmentType: 'Salaried',
      annualIncome: 1800000,
      monthlyIncome: 150000,
      existingEmi: 25000,
      creditScore: 740,
      loanAmount: 1200000,
      loanPurpose: 'Higher Education Abroad',
      loanType: 'EDUCATION',
      loanTermMonths: 60,
      interestRate: 6.5,
      status: 'DOCUMENT_VERIFICATION',
      createdDate: '2026-03-04T09:15:00Z',
      submittedDate: '2026-03-04T09:45:00Z',
      remarks: 'Awaiting university admission offer letter validation.'
    },
    {
      id: 104,
      userId: 3,
      fullName: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '9711883344',
      address: '15 Financial Center, Connaught Place',
      employerName: 'Malhotra Enterprises',
      jobTitle: 'Founder & CEO',
      employmentType: 'Business',
      annualIncome: 3500000,
      monthlyIncome: 291666,
      existingEmi: 45000,
      creditScore: 690,
      loanAmount: 2500000,
      loanPurpose: 'Business Expansion',
      loanType: 'BUSINESS',
      loanTermMonths: 48,
      interestRate: 12.0,
      status: 'SUBMITTED',
      createdDate: '2026-03-05T11:00:00Z',
      submittedDate: '2026-03-05T11:10:00Z'
    },
    {
      id: 105,
      userId: 4,
      fullName: 'Ananya Roy',
      email: 'ananya.roy@example.com',
      phone: '9900114455',
      address: '78 Park Street, Kolkata',
      employerName: 'Creative Design Studio',
      jobTitle: 'UX Designer',
      employmentType: 'Freelancer',
      annualIncome: 900000,
      monthlyIncome: 75000,
      existingEmi: 12000,
      creditScore: 620,
      loanAmount: 800000,
      loanPurpose: 'Personal Loan',
      loanType: 'PERSONAL',
      loanTermMonths: 36,
      interestRate: 11.5,
      status: 'REJECTED',
      createdDate: '2026-01-20T16:00:00Z',
      submittedDate: '2026-01-20T16:20:00Z',
      remarks: 'Income proof documents do not meet the minimum required debt-to-income threshold.'
    }
  ];

  constructor(private http: HttpClient) {}

  private isMock(): boolean {
    const token = localStorage.getItem('finflow_token');
    return environment.mockMode || !token || token.startsWith('mock_');
  }

  createApplication(request: ApplicationRequest): Observable<LoanApplication> {
    if (this.isMock()) {
      const newApp: LoanApplication = {
        id: 100 + this.mockApplications.length + 1,
        userId: request.userId || 1,
        fullName: request.fullName,
        email: request.email,
        phone: request.phone,
        address: request.address,
        employerName: request.employerName,
        jobTitle: request.jobTitle,
        employmentType: request.employmentType || 'Salaried',
        annualIncome: request.annualIncome,
        monthlyIncome: request.monthlyIncome || request.annualIncome / 12,
        existingEmi: request.existingEmi || 0,
        creditScore: request.creditScore || 750,
        loanAmount: request.loanAmount,
        loanPurpose: request.loanPurpose,
        loanType: request.loanType || this.inferLoanType(request.loanPurpose),
        loanTermMonths: request.loanTermMonths,
        interestRate: this.calculateLocalRate(request.loanAmount, request.loanPurpose),
        status: 'DRAFT',
        createdDate: new Date().toISOString()
      };
      this.mockApplications.unshift(newApp);
      return of(newApp);
    }

    return this.http.post<LoanApplication>(this.apiUrl, request).pipe(
      timeout(2500),
      catchError(() => {
        const newApp: LoanApplication = {
          id: 100 + this.mockApplications.length + 1,
          userId: request.userId || 1,
          fullName: request.fullName,
          email: request.email,
          phone: request.phone,
          address: request.address,
          employerName: request.employerName,
          jobTitle: request.jobTitle,
          employmentType: request.employmentType || 'Salaried',
          annualIncome: request.annualIncome,
          monthlyIncome: request.monthlyIncome || request.annualIncome / 12,
          existingEmi: request.existingEmi || 0,
          creditScore: request.creditScore || 750,
          loanAmount: request.loanAmount,
          loanPurpose: request.loanPurpose,
          loanType: request.loanType || this.inferLoanType(request.loanPurpose),
          loanTermMonths: request.loanTermMonths,
          interestRate: this.calculateLocalRate(request.loanAmount, request.loanPurpose),
          status: 'DRAFT',
          createdDate: new Date().toISOString()
        };
        this.mockApplications.unshift(newApp);
        return of(newApp);
      })
    );
  }

  getAllApplications(): Observable<LoanApplication[]> {
    if (this.isMock()) {
      return of([...this.mockApplications]);
    }

    return this.http.get<LoanApplication[]>(this.apiUrl).pipe(
      timeout(2500),
      catchError(() => of([...this.mockApplications]))
    );
  }

  getMyApplications(): Observable<LoanApplication[]> {
    const currentUser = JSON.parse(localStorage.getItem('finflow_user') || '{}');
    const filterUserApps = () => {
      if (!currentUser || !currentUser.email) return [];
      // If user is demo applicant rahul.sharma@example.com, return pre-seeded apps
      return this.mockApplications.filter(a => 
        a.userId === currentUser.id || 
        (a.email && currentUser.email && a.email.toLowerCase() === currentUser.email.toLowerCase())
      );
    };

    if (this.isMock()) {
      return of(filterUserApps());
    }

    return this.http.get<LoanApplication[]>(`${this.apiUrl}/user`).pipe(
      timeout(2500),
      catchError(() => of(filterUserApps()))
    );
  }

  getApplicationById(id: number): Observable<LoanApplication> {
    if (this.isMock()) {
      const found = this.mockApplications.find(a => a.id === Number(id));
      if (found) return of(found);
      return of(this.mockApplications[0]);
    }

    return this.http.get<LoanApplication>(`${this.apiUrl}/${id}`).pipe(
      timeout(2500),
      catchError(() => {
        const found = this.mockApplications.find(a => a.id === Number(id));
        if (found) return of(found);
        return of(this.mockApplications[0]);
      })
    );
  }

  submitApplication(id: number): Observable<{ message: string; status: string }> {
    if (this.isMock()) {
      const found = this.mockApplications.find(a => a.id === Number(id));
      if (found) {
        found.status = 'SUBMITTED';
        found.submittedDate = new Date().toISOString();
      }
      return of({ message: 'Application submitted successfully', status: 'SUBMITTED' });
    }

    return this.http.post<{ message: string; status: string }>(`${this.apiUrl}/${id}/submit`, {}).pipe(
      catchError(() => {
        const found = this.mockApplications.find(a => a.id === Number(id));
        if (found) {
          found.status = 'SUBMITTED';
          found.submittedDate = new Date().toISOString();
        }
        return of({ message: 'Application submitted successfully', status: 'SUBMITTED' });
      })
    );
  }

  updateApplicationStatus(id: number, status: string, remarks?: string): Observable<string> {
    if (this.isMock()) {
      const found = this.mockApplications.find(a => a.id === Number(id));
      if (found) {
        found.status = status as ApplicationStatus;
        if (remarks) found.remarks = remarks;
      }
      return of(`Status updated to ${status}`);
    }

    return this.http.put(`${this.apiUrl}/${id}/status`, null, {
      params: { status, remarks: remarks || '' },
      responseType: 'text'
    }).pipe(
      catchError(() => {
        const found = this.mockApplications.find(a => a.id === Number(id));
        if (found) {
          found.status = status as ApplicationStatus;
          if (remarks) found.remarks = remarks;
        }
        return of(`Status updated to ${status}`);
      })
    );
  }

  estimateInterestRate(amount: number, purpose: string): Observable<number> {
    if (this.isMock()) {
      return of(this.calculateLocalRate(amount, purpose));
    }

    return this.http.get<number>(`${this.apiUrl}/calculate-rate`, {
      params: { amount: amount.toString(), purpose }
    }).pipe(
      catchError(() => of(this.calculateLocalRate(amount, purpose)))
    );
  }

  calculateLocalRate(amount: number, purpose: string): number {
    let baseRate = 9.5;
    const lowerPurpose = purpose.toLowerCase();
    
    if (lowerPurpose.includes('home')) baseRate = 8.0;
    else if (lowerPurpose.includes('education')) baseRate = 6.5;
    else if (lowerPurpose.includes('vehicle') || lowerPurpose.includes('car')) baseRate = 9.0;
    else if (lowerPurpose.includes('business')) baseRate = 12.0;
    else if (lowerPurpose.includes('personal')) baseRate = 10.5;

    if (amount > 2500000) baseRate += 0.5;
    if (amount < 100000) baseRate += 1.0;

    return Number(baseRate.toFixed(2));
  }

  private inferLoanType(purpose: string): string {
    const lower = purpose.toLowerCase();
    if (lower.includes('home')) return 'HOME';
    if (lower.includes('education')) return 'EDUCATION';
    if (lower.includes('vehicle') || lower.includes('car')) return 'VEHICLE';
    if (lower.includes('business')) return 'BUSINESS';
    return 'PERSONAL';
  }
}
