import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

// הגדר את בסיס ה-API שלך. אם הפורט שונה אצלך, עדכן כאן.
const API_BASE = 'http://localhost:5285';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/api/auth/register`, { email, password })
      .pipe(
        catchError(err => {
          // נחזיר הודעה קריאה
          const msg = err?.error?.message ?? err?.statusText ?? 'Registration failed';
          return throwError(() => new Error(msg));
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/api/auth/login`, { email, password })
      .pipe(
        catchError(err => {
          const msg = err?.error?.message ?? (err.status === 401 ? 'Unauthorized' : err?.statusText ?? 'Login failed');
          return throwError(() => new Error(msg));
        })
      );
  }
}
