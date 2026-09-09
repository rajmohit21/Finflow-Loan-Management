export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'DOCUMENT_VERIFICATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'DISBURSED';

export type LoanType = 
  | 'PERSONAL' 
  | 'HOME' 
  | 'EDUCATION' 
  | 'VEHICLE' 
  | 'BUSINESS';

export interface ApplicationRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  employerName: string;
  jobTitle: string;
  employmentType?: string;
  workExperienceYears?: number;
  annualIncome: number;
  monthlyIncome?: number;
  existingEmi?: number;
  creditScore?: number;
  loanAmount: number;
  loanPurpose: string;
  loanType?: LoanType;
  loanTermMonths: number;
  userId?: number;
  remarks?: string;
}

export interface LoanApplication {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  employerName: string;
  jobTitle: string;
  employmentType?: string;
  annualIncome: number;
  monthlyIncome?: number;
  existingEmi?: number;
  creditScore?: number;
  loanAmount: number;
  loanPurpose: string;
  loanType: LoanType | string;
  loanTermMonths: number;
  tenureMonths?: number;
  interestRate: number;
  status: ApplicationStatus;
  remarks?: string;
  createdDate?: string;
  submittedDate?: string;
  updatedDate?: string;
}
