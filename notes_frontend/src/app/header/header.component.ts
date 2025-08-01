import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  // PUBLIC_INTERFACE
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
