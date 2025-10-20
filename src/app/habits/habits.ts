import { Component } from '@angular/core';

type HabitVm = { id: number; title: string; color?: string | null; isArchived: boolean; streak: number; };

@Component({
  selector: 'app-habits',
  standalone: false,
  templateUrl: './habits.html',
  styleUrl: './habits.css'
})
export class Habits {
  habits: HabitVm[] = [];   // ✅ השאר רק את זו
  newTitle = '';
  newColor: string | null = '#00AEEF';
  private nextId = 1;

  addHabit() {
    const title = (this.newTitle || '').trim();
    if (title.length < 3) return;

    this.habits.push({
      id: this.nextId++,
      title,
      color: this.newColor,
      isArchived: false,
      streak: 0
    });

    this.newTitle = '';
    this.newColor = '#00AEEF';
  }

  checkin(h: HabitVm) {
    h.streak += 1;
  }

  archive(h: HabitVm) {
    h.isArchived = true;
    this.habits = this.habits.filter(x => !x.isArchived);
  }
}
