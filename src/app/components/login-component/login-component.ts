import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../Model/user.model';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: '',
  };

  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.credentials.username && this.credentials.password) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.credentials).subscribe({
        next: (user) => {
          this.isLoading = false;
          if (user) {
            if (user.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/profile']);
            }
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Login failed. Please try again.';
        },
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
