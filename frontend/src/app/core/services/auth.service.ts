import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthRequest, SignupRequest, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public currentUserSignal = signal<User | null>(this.getStoredUser());
  private fallbackActive: boolean = false;

  constructor(private http: HttpClient) {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem('finflow_token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !!this.currentUserValue;
  }

  public getRole(): UserRole | null {
    return this.currentUserValue?.role || null;
  }

  public isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  public isApplicant(): boolean {
    const role = this.getRole();
    return role === 'USER' || role === 'APPLICANT';
  }

  public isMockToken(): boolean {
    const token = this.getToken();
    return !!token && token.startsWith('mock_');
  }

  public isMockSession(): boolean {
    return environment.mockMode || this.fallbackActive || this.isMockToken();
  }

  login(credentials: AuthRequest): Observable<string> {
    if (environment.mockMode) {
      return this.mockLogin(credentials);
    }

    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' }).pipe(
      timeout(3000),
      tap((token: string) => {
        this.setSession(token, credentials.email);
      }),
      catchError(err => {
        console.warn('Backend login unavailable or timed out. Falling back to mock authentication:', err);
        this.fallbackActive = true;
        return this.mockLogin(credentials);
      })
    );
  }

  signup(request: SignupRequest): Observable<string> {
    this.registerLocalUser(request);
    if (this.isMockSession()) {
      return of("User registered successfully");
    }

    return this.http.post(`${this.apiUrl}/signup`, request, { responseType: 'text' }).pipe(
      timeout(2500),
      catchError(() => {
        this.fallbackActive = true;
        return of("User registered successfully");
      })
    );
  }

  public registerLocalUser(request: SignupRequest): void {
    const existing: User[] = JSON.parse(localStorage.getItem('finflow_users_db') || '[]');
    const id = Date.now();
    const newUser: User = {
      id: id,
      name: request.fullName || request.email.split('@')[0],
      email: request.email,
      phone: request.phone || '9876543210',
      role: (request.role as UserRole) || (request.email.toLowerCase().includes('admin') ? 'ADMIN' : 'APPLICANT'),
      token: 'mock_jwt_token_' + id,
      active: true,
      createdAt: new Date().toISOString()
    };
    const updated = existing.filter(u => u.email.toLowerCase() !== request.email.toLowerCase());
    updated.push(newUser);
    localStorage.setItem('finflow_users_db', JSON.stringify(updated));
  }

  private setSession(token: string, email: string): void {
    localStorage.setItem('finflow_token', token);
    
    const emailLower = email.toLowerCase();
    const usersDb: User[] = JSON.parse(localStorage.getItem('finflow_users_db') || '[]');
    const foundUser = usersDb.find(u => u.email.toLowerCase() === emailLower);

    const role: UserRole = emailLower.includes('admin') ? 'ADMIN' : 'APPLICANT';
    const user: User = foundUser ? { ...foundUser, token } : {
      id: Math.floor(Math.random() * 1000) + 1,
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: role,
      token: token,
      active: true,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('finflow_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.currentUserSignal.set(user);
  }

  private mockLogin(credentials: AuthRequest): Observable<string> {
    const mockToken = "mock_jwt_token_" + Date.now();
    const emailLower = credentials.email.toLowerCase();
    const isAdmin = emailLower.includes('admin');
    
    const usersDb: User[] = JSON.parse(localStorage.getItem('finflow_users_db') || '[]');
    const foundUser = usersDb.find(u => u.email.toLowerCase() === emailLower);

    let mockUser: User;
    if (foundUser) {
      mockUser = { ...foundUser, token: mockToken };
    } else {
      const defaultName = isAdmin 
        ? 'System Underwriter' 
        : (emailLower.includes('rahul') ? 'Rahul Sharma' : credentials.email.split('@')[0].replace('.', ' ').toUpperCase());

      mockUser = {
        id: isAdmin ? 99 : (emailLower.includes('rahul') ? 1 : Math.floor(Math.random() * 1000) + 10),
        name: defaultName,
        email: credentials.email,
        phone: '9876543210',
        role: isAdmin ? 'ADMIN' : 'APPLICANT',
        token: mockToken,
        address: '42 Financial Park, Cyber City',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        active: true,
        createdAt: '2026-01-15T10:00:00Z'
      };
    }

    localStorage.setItem('finflow_token', mockToken);
    localStorage.setItem('finflow_user', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    this.currentUserSignal.set(mockUser);

    return of(mockToken);
  }

  updateProfile(updatedData: Partial<User>): Observable<User> {
    const current = this.currentUserValue;
    if (!current) return throwError(() => new Error('Not logged in'));

    const updatedUser = { ...current, ...updatedData };

    // 1. Update active session user
    localStorage.setItem('finflow_user', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
    this.currentUserSignal.set(updatedUser);

    // 2. Permanently sync changes into finflow_users_db registry
    const usersDb: User[] = JSON.parse(localStorage.getItem('finflow_users_db') || '[]');
    const existingIndex = usersDb.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase() || u.id === updatedUser.id);
    if (existingIndex !== -1) {
      usersDb[existingIndex] = updatedUser;
    } else {
      usersDb.push(updatedUser);
    }
    localStorage.setItem('finflow_users_db', JSON.stringify(usersDb));
    
    if (!environment.mockMode) {
      return this.http.put<User>(`${environment.apiUrl}/users/${current.id}`, updatedData).pipe(
        catchError(() => of(updatedUser))
      );
    }
    return of(updatedUser);
  }

  logout(): void {
    localStorage.removeItem('finflow_token');
    localStorage.removeItem('finflow_user');
    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('finflow_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
