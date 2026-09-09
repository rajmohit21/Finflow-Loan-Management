export interface Report {
  id: number;
  eventType: string;
  description: string;
  timestamp: string;
  sourceService: string;
  applicationId?: number;
  userId?: number;
}
