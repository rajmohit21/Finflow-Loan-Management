import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Document, DocumentStatus, FileType } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  private mockDocuments: Document[] = [
    {
      id: 501,
      applicationId: 101,
      fileName: 'Rahul_Aadhaar_Card.pdf',
      fileType: 'AADHAAR',
      fileSize: 1048576,
      status: 'VERIFIED',
      uploadDate: '2026-03-01T10:15:00Z',
      remarks: 'Verified against UIDAI database.'
    },
    {
      id: 502,
      applicationId: 101,
      fileName: 'Rahul_PAN_Card.jpg',
      fileType: 'PAN_CARD',
      fileSize: 524288,
      status: 'VERIFIED',
      uploadDate: '2026-03-01T10:18:00Z'
    },
    {
      id: 503,
      applicationId: 101,
      fileName: 'Salary_Slip_Feb_2026.pdf',
      fileType: 'SALARY_SLIP',
      fileSize: 2097152,
      status: 'UNDER_REVIEW',
      uploadDate: '2026-03-01T10:25:00Z'
    },
    {
      id: 504,
      applicationId: 102,
      fileName: 'Home_Property_Deed.pdf',
      fileType: 'ID_PROOF',
      fileSize: 4194304,
      status: 'VERIFIED',
      uploadDate: '2026-02-10T14:30:00Z'
    },
    {
      id: 505,
      applicationId: 103,
      fileName: 'Bank_Statement_6M.pdf',
      fileType: 'BANK_STATEMENT',
      fileSize: 3145728,
      status: 'PENDING',
      uploadDate: '2026-03-04T09:30:00Z'
    }
  ];

  constructor(private http: HttpClient) {}

  private isMock(): boolean {
    const token = localStorage.getItem('finflow_token');
    return environment.mockMode || !token || token.startsWith('mock_');
  }

  uploadDocument(applicationId: number, fileType: string, file: File): Observable<Document> {
    if (this.isMock()) {
      const newDoc: Document = {
        id: 500 + this.mockDocuments.length + 1,
        applicationId,
        fileName: file.name,
        fileType: fileType as FileType,
        fileSize: file.size,
        status: 'PENDING',
        uploadDate: new Date().toISOString()
      };
      this.mockDocuments.unshift(newDoc);
      return of(newDoc);
    }

    const formData = new FormData();
    formData.append('applicationId', applicationId.toString());
    formData.append('fileType', fileType);
    formData.append('file', file);

    return this.http.post<Document>(`${this.apiUrl}/upload`, formData).pipe(
      timeout(2500),
      catchError(() => {
        const newDoc: Document = {
          id: 500 + this.mockDocuments.length + 1,
          applicationId,
          fileName: file.name,
          fileType: fileType as FileType,
          fileSize: file.size,
          status: 'PENDING',
          uploadDate: new Date().toISOString()
        };
        this.mockDocuments.unshift(newDoc);
        return of(newDoc);
      })
    );
  }

  getDocumentsByApplication(applicationId: number): Observable<Document[]> {
    const filterAppDocs = () => this.mockDocuments.filter(d => d.applicationId === Number(applicationId));

    if (this.isMock()) {
      return of(filterAppDocs());
    }

    return this.http.get<Document[]>(`${this.apiUrl}/application/${applicationId}`).pipe(
      timeout(2500),
      catchError(() => of(filterAppDocs()))
    );
  }

  getAllDocuments(): Observable<Document[]> {
    return of([...this.mockDocuments]);
  }

  verifyDocument(id: number, status: string, remarks?: string): Observable<Document> {
    const updateDoc = () => {
      const doc = this.mockDocuments.find(d => d.id === Number(id));
      if (doc) {
        doc.status = status as DocumentStatus;
        if (remarks) doc.remarks = remarks;
        return doc;
      }
      return {
        id: Number(id),
        applicationId: 101,
        fileName: 'Document.pdf',
        fileType: 'AADHAAR' as FileType,
        fileSize: 1024,
        status: status as DocumentStatus,
        uploadDate: new Date().toISOString()
      };
    };

    if (this.isMock()) {
      return of(updateDoc());
    }

    return this.http.put<Document>(`${this.apiUrl}/${id}/verify`, null, {
      params: { status }
    }).pipe(
      timeout(2500),
      catchError(() => of(updateDoc()))
    );
  }

  getDocumentViewUrl(id: number): string {
    return `${this.apiUrl}/${id}/view`;
  }
}
