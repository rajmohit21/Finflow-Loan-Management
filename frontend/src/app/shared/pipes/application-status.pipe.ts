import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'applicationStatus',
  standalone: true
})
export class ApplicationStatusPipe implements PipeTransform {
  transform(status: string | null | undefined): string {
    if (!status) return 'Unknown';

    switch (status.toUpperCase()) {
      case 'DRAFT': return 'Draft Saved';
      case 'SUBMITTED': return 'Submitted';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'DOCUMENT_VERIFICATION': return 'Document Verification';
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      case 'DISBURSED': return 'Funds Disbursed';
      case 'PENDING': return 'Pending Review';
      case 'VERIFIED': return 'Verified';
      default: return status.replace(/_/g, ' ');
    }
  }
}
