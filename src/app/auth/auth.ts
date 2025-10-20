import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  registerEmail = '';
  registerPassword = '';
  loginEmail = '';
  loginPassword = '';

  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private auth: AuthService) {}

  onRegister() {
    this.resetMsgs();
    this.loading = true;

    this.auth.register(this.registerEmail, this.registerPassword).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.message = 'Registered successfully ✅';
          if (res.token) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('auth_email', this.registerEmail); // שימושי ל-X-User-Email בהמשך
          }
        } else {
          this.error = res.message || 'Registration failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Registration failed';
      }
    });
  }

  onLogin() {
    this.resetMsgs();
    this.loading = true;

    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.message = 'Logged in successfully ✅';
          if (res.token) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('auth_email', this.loginEmail);
          }
        } else {
          this.error = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Login failed';
      }
    });
  }

  private resetMsgs() {
    this.message = null;
    this.error = null;
  }
}
