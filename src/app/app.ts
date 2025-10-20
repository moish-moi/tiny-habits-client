import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service'; // ✅ חדש

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('tiny-habits-client');

  message: string | null = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService           // ✅ חדש
  ) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5285/ping', { responseType: 'text' })
      .subscribe({
        next: (res) => this.message = res,
        error: () => this.message = 'Error connecting to API 😢'
      });
  }

  // ✅ חדש: נגיש לתבנית כדי להחליט אם להציג <app-habits>
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
