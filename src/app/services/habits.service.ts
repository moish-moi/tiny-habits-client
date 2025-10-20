import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const API_BASE = 'http://localhost:5285';

export type HabitResponse = {
  id: number;
  title: string;
  color?: string | null;
  isArchived: boolean;
  streak: number;
};

@Injectable({ providedIn: 'root' })
export class HabitsService {
  constructor(private http: HttpClient) {}

  private makeHeaders(): HttpHeaders {
    const email = localStorage.getItem('auth_email') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-Email': email
    });
  }

  list(): Observable<HabitResponse[]> {
    return this.http.get<HabitResponse[]>(`${API_BASE}/api/habits`, {
      headers: this.makeHeaders()
    }).pipe(
      catchError(err => throwError(() => new Error(this.normalizeError(err))))
    );
  }

  create(title: string, color?: string | null): Observable<HabitResponse> {
    return this.http.post<HabitResponse>(`${API_BASE}/api/habits`, { title, color }, {
      headers: this.makeHeaders()
    }).pipe(
      catchError(err => throwError(() => new Error(this.normalizeError(err))))
    );
  }

  checkinToday(habitId: number): Observable<{ id: number; date: string }> {
    // date=null → היום (לפי השרת)
    return this.http.post<{ id: number; date: string }>(`${API_BASE}/api/habits/${habitId}/checkins`, { date: null }, {
      headers: this.makeHeaders()
    }).pipe(
      catchError(err => throwError(() => new Error(this.normalizeError(err))))
    );
  }

  private normalizeError(err: any): string {
    if (err?.status === 401) return 'Unauthorized (login/register first)';
    if (err?.status === 404) return 'Habit not found';
    if (err?.status === 409) return 'Check-in already exists for today';
    return err?.error?.message || err?.statusText || 'Request failed';
  }
}
