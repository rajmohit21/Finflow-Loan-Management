export interface AppNotification {
  id: string | number;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  applicationId?: number;
  actionUrl?: string;
}
