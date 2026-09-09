export type DecisionType = 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'DOCUMENT_VERIFICATION';

export interface Decision {
  id?: number;
  applicationId: number;
  decisionType: DecisionType;
  remarks: string;
  decidedBy?: number;
  createdDate?: string;
}
