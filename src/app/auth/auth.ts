import { Component } from '@angular/core';

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

  onRegister() {
    console.log('Register clicked', this.registerEmail, this.registerPassword);
  }

  onLogin() {
    console.log('Login clicked', this.loginEmail, this.loginPassword);
  }
}
