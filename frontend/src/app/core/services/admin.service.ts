import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoanApplication } from '../models/application.model';
import { Decision } from '../models/decision.model';
import { Report } from '../models/report.model';
import { ApplicationService } from './application.service';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  private mockReports: Report[] = [
    {
      id: 901,
      eventType: 'APPLICATION_SUBMITTED',
      description: 'Loan Application #104 (BUSINESS) submitted by Vikram Malhotra',
      timestamp: '2026-03-05T11:10:00Z',
      sourceService: 'APPLICATION-SERVICE',
      applicationId: 104,
      userId: 3
    },
    {
      id: 902,
      eventType: 'DOCUMENT_UPLOADED',
      description: 'Bank Statement 6M uploaded for Application #103',
      timestamp: '2026-03-04T09:30:00Z',
      sourceService: 'DOCUMENT-SERVICE',
      applicationId: 103,
      userId: 2
    },
    {
      id: 903,
      eventType: 'UNDERWRITER_DECISION',
      description: 'Application #102 decision: APPROVED by Underwriter #99',
      timestamp: '2026-02-12T15:30:00Z',
      sourceService: 'ADMIN-SERVICE',
      applicationId: 102,
      userId: 1
    },
    {
      id: 904,
      eventType: 'DOCUMENT_VERIFIED',
      description: 'Aadhaar Card verified for Application #101',
      timestamp: '2026-03-01T11:00:00Z',
      sourceService: 'DOCUMENT-SERVICE',
      applicationId: 101,
      userId: 1
    }
  ];

  constructor(
    private http: HttpClient,
    private applicationService: ApplicationService,
    private documentService: DocumentService
  ) {}

  private isMock(): boolean {
    const token = localStorage.getItem('finflow_token');
    return environment.mockMode || !token || token.startsWith('mock_');
  }

  getAllApplications(): Observable<LoanApplication[]> {
    if (this.isMock()) {
      return this.applicationService.getAllApplications();
    }

    return this.http.get<LoanApplication[]>(`${this.apiUrl}/applications`).pipe(
      catchError(() => {
        return this.applicationService.getAllApplications();
      })
    );
  }

  makeDecision(applicationId: number, decision: Decision): Observable<Decision> {
    if (this.isMock()) {
      this.applicationService.updateApplicationStatus(applicationId, decision.decisionType, decision.remarks).subscribe();
      const newReport: Report = {
        id: Date.now(),
        eventType: 'UNDERWRITER_DECISION',
        description: `Application #${applicationId} set to ${decision.decisionType} by Underwriter. Remarks: ${decision.remarks}`,
        timestamp: new Date().toISOString(),
        sourceService: 'ADMIN-SERVICE',
        applicationId
      };
      this.mockReports.unshift(newReport);
      return of({
        id: Math.floor(Math.random() * 1000),
        applicationId,
        decisionType: decision.decisionType,
        remarks: decision.remarks,
        decidedBy: 99,
        createdDate: new Date().toISOString()
      });
    }

    return this.http.post<Decision>(`${this.apiUrl}/applications/${applicationId}/decision`, decision).pipe(
      catchError(() => {
        this.applicationService.updateApplicationStatus(applicationId, decision.decisionType, decision.remarks).subscribe();
        const newReport: Report = {
          id: Date.now(),
          eventType: 'UNDERWRITER_DECISION',
          description: `Application #${applicationId} set to ${decision.decisionType} by Underwriter. Remarks: ${decision.remarks}`,
          timestamp: new Date().toISOString(),
          sourceService: 'ADMIN-SERVICE',
          applicationId
        };
        this.mockReports.unshift(newReport);
        return of({
          id: Math.floor(Math.random() * 1000),
          applicationId,
          decisionType: decision.decisionType,
          remarks: decision.remarks,
          decidedBy: 99,
          createdDate: new Date().toISOString()
        });
      })
    );
  }

  verifyDocument(documentId: number, status: string): Observable<string> {
    this.documentService.verifyDocument(documentId, status).subscribe();
    if (this.isMock()) {
      return of(`Document ${status.toLowerCase()}`);
    }

    return this.http.put(`${this.apiUrl}/documents/${documentId}/verify`, null, {
      params: { status },
      responseType: 'text'
    }).pipe(
      catchError(() => {
        return of(`Document ${status.toLowerCase()}`);
      })
    );
  }

  getReports(): Observable<Report[]> {
    if (this.isMock()) {
      return of([...this.mockReports]);
    }

    return this.http.get<Report[]>(`${this.apiUrl}/reports`).pipe(
      catchError(() => {
        return of([...this.mockReports]);
      })
    );
  }
}
