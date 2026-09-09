import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private initialNotifications: AppNotification[] = [
    {
      id: '1',
      title: 'Application Under Review',
      message: 'Your Personal Loan application #101 is currently under credit evaluation by our underwriting team.',
      timestamp: '2 hours ago',
      type: 'info',
      read: false,
      applicationId: 101
    },
    {
      id: '2',
      title: 'Document Approved',
      message: 'Your Aadhaar Card document has been successfully verified.',
      timestamp: '1 day ago',
      type: 'success',
      read: false,
      applicationId: 101
    },
    {
      id: '3',
      title: 'Home Loan Approved! 🎉',
      message: 'Congratulations! Your Home Loan application #102 for ₹45,00,000 has been approved.',
      timestamp: '3 days ago',
      type: 'success',
      read: true,
      applicationId: 102
    }
  ];

  private notificationsSubject = new BehaviorSubject<AppNotification[]>(this.initialNotifications);
  notifications$ = this.notificationsSubject.asObservable();

  // Signals representation
  notificationsSignal = signal<AppNotification[]>(this.initialNotifications);
  unreadCount = computed(() => this.notificationsSignal().filter(n => !n.read).length);

  getNotifications(): Observable<AppNotification[]> {
    return this.notifications$;
  }

  markAsRead(id: string | number): void {
    const updated = this.notificationsSubject.value.map(n => {
      if (n.id.toString() === id.toString()) {
        return { ...n, read: true };
      }
      return n;
    });
    this.notificationsSubject.next(updated);
    this.notificationsSignal.set(updated);
  }

  markAllAsRead(): void {
    const updated = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
    this.notificationsSignal.set(updated);
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const newNotif: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: 'Just now',
      read: false
    };
    const updated = [newNotif, ...this.notificationsSubject.value];
    this.notificationsSubject.next(updated);
    this.notificationsSignal.set(updated);
  }
}
