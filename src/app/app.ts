import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('tiny-habits-client');

  message: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // שים לב לשם הפורט של השרת שלך (5285 לפי הדוגמאות שלנו)
    this.http.get('http://localhost:5285/ping', { responseType: 'text' })
      .subscribe({
        next: (res) => this.message = res,
        error: () => this.message = 'Error connecting to API 😢'
      });
  }
}
