import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Especialidad } from '../../../core/models/especialidad.model';
import { Especialidades } from '../../../core/services/especialidades';

@Component({
  selector: 'app-especialidad-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './especialidad-list.html',
  styleUrl: './especialidad-list.css',
})
export class EspecialidadList implements OnInit {
  especialidades: Especialidad[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly especialidadesService: Especialidades,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.especialidadesService.listar().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las especialidades.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  eliminar(especialidad: Especialidad): void {
    const confirmado = window.confirm(
      `¿Eliminar la especialidad ${especialidad.nombre}?`,
    );

    if (!confirmado) {
      return;
    }

    this.especialidadesService
      .eliminar(especialidad.id)
      .subscribe({
        next: () => this.cargar(),
        error: () => {
          this.errorMessage =
            'No fue posible eliminar la especialidad.';
        },
      });
  }
}