import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Atencion } from '../../../core/models/atencion.model';
import { Cita } from '../../../core/models/cita.model';
import { Mascota } from '../../../core/models/mascota.model';

import { Atenciones } from '../../../core/services/atenciones';
import { Citas } from '../../../core/services/citas';
import { Mascotas } from '../../../core/services/mascotas';

@Component({
  selector: 'app-atencion-list',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './atencion-list.html',
  styleUrl: './atencion-list.css',
})
export class AtencionList implements OnInit {
  atenciones: Atencion[] = [];
  atencionesFiltradas: Atencion[] = [];

  citas: Cita[] = [];
  mascotas: Mascota[] = [];

  filtro = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly atencionesService: Atenciones,
    private readonly citasService: Citas,
    private readonly mascotasService: Mascotas,
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarAtenciones();
  }

  cargarCatalogos(): void {
    this.citasService.listar().subscribe({
      next: (citas) => {
        this.citas = citas;
      },
    });

    this.mascotasService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
      },
    });
  }

  cargarAtenciones(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.atencionesService.listar().subscribe({
      next: (atenciones) => {
        this.atenciones = atenciones;
        this.atencionesFiltradas = atenciones;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las atenciones.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  obtenerCita(id: number): Cita | undefined {
    return this.citas.find(
      (cita) => cita.id === id,
    );
  }

  nombreMascota(citaId: number): string {
    const cita = this.obtenerCita(citaId);

    if (!cita) {
      return 'Mascota no disponible';
    }

    return (
      this.mascotas.find(
        (mascota) => mascota.id === cita.mascota,
      )?.nombre ?? 'Mascota no disponible'
    );
  }

  fechaCita(citaId: number): string {
    const cita = this.obtenerCita(citaId);

    if (!cita) {
      return '—';
    }

    return `${cita.fecha} ${cita.hora.slice(0, 5)}`;
  }

  buscar(valor: string): void {
    this.filtro = valor.trim().toLowerCase();

    if (!this.filtro) {
      this.atencionesFiltradas = this.atenciones;
      return;
    }

    this.atencionesFiltradas =
      this.atenciones.filter((atencion) => {
        const contenido = [
          this.nombreMascota(atencion.cita),
          atencion.motivo,
          atencion.diagnostico,
          atencion.tratamiento,
        ]
          .join(' ')
          .toLowerCase();

        return contenido.includes(this.filtro);
      });
  }

  eliminar(atencion: Atencion): void {
    const confirmado = window.confirm(
      `¿Eliminar la atención de ${this.nombreMascota(atencion.cita)}?`,
    );

    if (!confirmado) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.atencionesService
      .eliminar(atencion.id)
      .subscribe({
        next: () => {
          this.successMessage =
            'Atención eliminada correctamente.';

          this.cargarAtenciones();
        },
        error: (error) => {
          this.errorMessage =
            error.status === 403
              ? 'No tienes permisos para eliminar atenciones.'
              : 'No fue posible eliminar la atención.';
        },
      });
  }
}