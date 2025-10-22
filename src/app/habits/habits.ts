import { Component, OnInit } from '@angular/core';
import { HabitsService, HabitResponse } from '../services/habits.service';
import { AuthService } from '../services/auth.service';

type HabitVm = HabitResponse;

@Component({
  selector: 'app-habits',
  standalone: false,
  templateUrl: './habits.html',
  styleUrls: ['./habits.css'] // ← תיקון: היה styleUrl (יחיד) — צריך styleUrls (רבים)
})
export class Habits implements OnInit {
  habits: HabitVm[] = [];
  newTitle = '';
  newColor: string | null = '#00AEEF';

  loading = false;
  message: string | null = null;
  error: string | null = null;
  showArchived = false; 

  // ✅ נוסיף כאן את AuthService בתור public כדי שה־HTML יזהה את auth
  constructor(
    private api: HabitsService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.resetMsgs();
    this.loading = true;
    this.api.list(this.showArchived).subscribe({
      next: (items) => { this.habits = items; this.loading = false; },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }

  toggleArchived() {
    this.showArchived = !this.showArchived;
    this.load();
  }

  addHabit() {
    const title = (this.newTitle || '').trim();
    if (title.length < 3) return;

    this.resetMsgs();
    this.loading = true;

    this.api.create(title, this.newColor).subscribe({
      next: (h) => {
        this.loading = false;
        this.message = 'Habit created ✅';
        this.habits = [...this.habits, h];
        this.newTitle = '';
        this.newColor = '#00AEEF';
      },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }

  checkin(h: HabitVm) {
    this.resetMsgs();
    this.loading = true;

    this.api.checkinToday(h.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Check-in done for today ✅';
        this.load(); // טוען מחדש כדי לעדכן streak
      },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }

    // --- פעולות על הרגלים קיימים ---
  archive(h: HabitVm) {
    this.resetMsgs();
    this.loading = true;

    this.api.archive(h.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = `Habit "${h.title}" archived 🗂️`;
        this.load(); // ריענון הרשימה
      },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }

  unarchive(h: HabitVm) {
    this.resetMsgs();
    this.loading = true;

    this.api.unarchive(h.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = `Habit "${h.title}" restored ✅`;
        this.load();
      },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }

  deleteHabit(h: HabitVm) {
    if (!confirm(`Are you sure you want to delete "${h.title}"?`)) return;

    this.resetMsgs();
    this.loading = true;

    this.api.delete(h.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = `Habit "${h.title}" deleted 🗑️`;
        this.load();
      },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }


  private resetMsgs() {
    this.message = null;
    this.error = null;
  }
}
