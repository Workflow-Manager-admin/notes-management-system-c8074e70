import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./auth.css']
})
export class LoginComponent {
  loading = false;
  errorMsg = '';
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // PUBLIC_INTERFACE
  submit() {
    if (this.form.invalid) return;
    // Patch for type: form.value is Partial so need casting.
    const value = this.form.value as { username: string; password: string };
    this.loading = true;
    this.auth.login(value).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Login successful', 'Close', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = (err.error && err.error.detail) || 'Login failed';
        this.snack.open(this.errorMsg, 'Close', { duration: 3000, panelClass: 'error' });
      }
    });
  }
}
