import { Component, OnInit } from '@angular/core';
import { HabitsService, HabitResponse } from '../services/habits.service';

type HabitVm = HabitResponse;

@Component({
  selector: 'app-habits',
  standalone: false,
  templateUrl: './habits.html',
  styleUrl: './habits.css'
})
export class Habits implements OnInit {
  habits: HabitVm[] = [];
  newTitle = '';
  newColor: string | null = '#00AEEF';

  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private api: HabitsService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.resetMsgs();
    this.loading = true;
    this.api.list().subscribe({
      next: (items) => { this.habits = items; this.loading = false; },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
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
        // רענון streak מהרשימה (השרת מחזיר streak בחישוב)
        this.load();
      },
      error: (e) => { this.loading = false; this.error = e.message; }
    });
  }

  archive(_: HabitVm) {
    // אין לנו endpoint לארכוב כרגע — נסתיר ב־UI זמנית:
    this.error = 'Archive not implemented yet (server-side)';
  }

  private resetMsgs() { this.message = null; this.error = null; }
}
