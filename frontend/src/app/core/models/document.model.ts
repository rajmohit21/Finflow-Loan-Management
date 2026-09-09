export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW';

export type FileType = 'ID_PROOF' | 'SALARY_SLIP' | 'PAN_CARD' | 'AADHAAR' | 'BANK_STATEMENT' | 'EMPLOYMENT_PROOF';

export interface Document {
  id: number;
  applicationId: number;
  fileName: string;
  fileType: FileType | string;
  fileSize?: number;
  filePath?: string;
  fileUrl?: string;
  uploadDate?: string;
  status: DocumentStatus;
  remarks?: string;
}
