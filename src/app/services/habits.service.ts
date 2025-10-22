import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const API_BASE = 'http://localhost:5285/api';

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

  // שליפה של כל ההרגלים הפעילים למשתמש הנוכחי
 list(includeArchived = false): Observable<HabitResponse[]> {
  const params = includeArchived ? { includeArchived: 'true' } : undefined;
  return this.http.get<HabitResponse[]>(
    `${API_BASE}/habits`,
    { params }
  ).pipe(
    catchError(err => throwError(() => new Error(this.normalizeError(err))))
  );
}


  // יצירת הרגל חדש
  create(title: string, color?: string | null): Observable<HabitResponse> {
    return this.http.post<HabitResponse>(`${API_BASE}/habits`, { title, color }).pipe(
      catchError(err => throwError(() => new Error(this.normalizeError(err))))
    );
  }

  // סימון ביצוע של הרגל להיום
  checkinToday(habitId: number): Observable<{ id: number; date: string }> {
    return this.http.post<{ id: number; date: string }>(
      `${API_BASE}/habits/${habitId}/checkins`,
      { date: null }
    ).pipe(
      catchError(err => throwError(() => new Error(this.normalizeError(err))))
    );
  }

  archive(id: number) {
  return this.http.put<void>(`${API_BASE}/habits/${id}/archive`, {}).pipe(
    catchError(err => throwError(() => new Error(this.normalizeError(err))))
  );
}

unarchive(id: number) {
  return this.http.put<void>(`${API_BASE}/habits/${id}/unarchive`, {}).pipe(
    catchError(err => throwError(() => new Error(this.normalizeError(err))))
  );
}

delete(id: number) {
  return this.http.delete<void>(`${API_BASE}/habits/${id}`).pipe(
    catchError(err => throwError(() => new Error(this.normalizeError(err))))
  );
}


  // טיפול בשגיאות נפוצות
  private normalizeError(err: any): string {
    if (err?.status === 401) return 'Unauthorized (login/register first)';
    if (err?.status === 404) return 'Habit not found';
    if (err?.status === 409) return 'Check-in already exists for today';
    return err?.error?.message || err?.statusText || 'Request failed';
  }
}
