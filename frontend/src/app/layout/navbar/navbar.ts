import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private readonly authService: Auth,
    private readonly router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}