import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Especialidad } from '../../../core/models/especialidad.model';
import { Veterinario } from '../../../core/models/veterinario.model';
import { Especialidades } from '../../../core/services/especialidades';
import { Veterinarios } from '../../../core/services/veterinarios';

@Component({
  selector: 'app-veterinario-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './veterinario-list.html',
  styleUrl: './veterinario-list.css',
})
export class VeterinarioList implements OnInit {
  veterinarios: Veterinario[] = [];
  especialidades: Especialidad[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly veterinariosService: Veterinarios,
    private readonly especialidadesService: Especialidades,
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
    this.cargarVeterinarios();
  }

  cargarEspecialidades(): void {
    this.especialidadesService.listar().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
    });
  }

  cargarVeterinarios(): void {
    this.isLoading = true;

    this.veterinariosService.listar().subscribe({
      next: (veterinarios) => {
        this.veterinarios = veterinarios;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar los veterinarios.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  nombreEspecialidad(id: number | null): string {
    if (id === null) {
      return 'Sin especialidad';
    }

    return (
      this.especialidades.find(
        (especialidad) => especialidad.id === id,
      )?.nombre ?? 'Sin especialidad'
    );
  }

  eliminar(veterinario: Veterinario): void {
    const confirmado = window.confirm(
      `¿Eliminar a ${veterinario.nombres} ${veterinario.apellidos}?`,
    );

    if (!confirmado) {
      return;
    }

    this.veterinariosService
      .eliminar(veterinario.id)
      .subscribe({
        next: () => this.cargarVeterinarios(),
        error: (error) => {
          this.errorMessage =
            error.status === 403
              ? 'No tienes permisos para eliminar veterinarios.'
              : 'No fue posible eliminar el veterinario.';
        },
      });
  }
}