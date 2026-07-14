import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UsuarioActual } from '../../core/models/usuario-actual.model';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  usuario: UsuarioActual | null = null;

  constructor(
    private readonly authService: Auth,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const usuarioGuardado =
      this.authService.getUsuarioActual();

    if (usuarioGuardado) {
      this.usuario = usuarioGuardado;
      return;
    }

    this.authService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
    });
  }

  get nombreCompleto(): string {
    if (!this.usuario) {
      return 'Usuario';
    }

    const nombre = [
      this.usuario.first_name,
      this.usuario.last_name,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return nombre || this.usuario.username;
  }

  get nombreRol(): string {
    if (!this.usuario) {
      return 'Cargando...';
    }

    if (this.usuario.is_superuser) {
      return 'Administrador';
    }

    return this.formatearRol(
      this.usuario.rol_nombre ?? 'Sin rol',
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private formatearRol(rol: string): string {
    return rol.charAt(0).toUpperCase() + rol.slice(1);
  }
}