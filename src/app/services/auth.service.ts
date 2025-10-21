import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

// הגדר את בסיס ה-API שלך. אם הפורט שונה אצלך, עדכן כאן.
const API_BASE = 'http://localhost:5285';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ✅ הוספתי baseUrl קבוע לשימוש בפניות
  private readonly baseUrl = `${API_BASE}/api`;

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/register`, { email, password })
      .pipe(
        tap(res => {
          if (res.success && res.token) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('auth_email', email);
          }
        }),
        catchError(err => {
          const msg = err?.error?.message ?? err?.statusText ?? 'Registration failed';
          return throwError(() => new Error(msg));
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.success && res.token) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('auth_email', email);
          }
        }),
        catchError(err => {
          const msg = err?.error?.message ?? (err.status === 401 ? 'Unauthorized' : err?.statusText ?? 'Login failed');
          return throwError(() => new Error(msg));
        })
      );
  }

  getEmail(): string | null {
    return localStorage.getItem('auth_email');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getEmail() && !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_token');
  }
}
