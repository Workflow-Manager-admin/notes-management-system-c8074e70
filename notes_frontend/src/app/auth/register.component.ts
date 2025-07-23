import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./auth.css']
})
export class RegisterComponent {
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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // PUBLIC_INTERFACE
  submit() {
    if (this.form.invalid) return;
    const value = this.form.value as { username: string; password: string };
    this.loading = true;
    this.auth.register(value).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Registration successful', 'Close', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = (err.error && err.error.detail) || 'Registration failed';
        this.snack.open(this.errorMsg, 'Close', { duration: 3000, panelClass: 'error' });
      }
    });
  }
}
