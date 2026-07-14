import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Atencion } from '../../../core/models/atencion.model';
import { Cita } from '../../../core/models/cita.model';
import { Mascota } from '../../../core/models/mascota.model';
import { Receta } from '../../../core/models/receta.model';

import { Atenciones } from '../../../core/services/atenciones';
import { Citas } from '../../../core/services/citas';
import { Mascotas } from '../../../core/services/mascotas';
import { Recetas } from '../../../core/services/recetas';

@Component({
  selector: 'app-receta-list',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './receta-list.html',
  styleUrl: './receta-list.css',
})
export class RecetaList implements OnInit {
  recetas: Receta[] = [];
  recetasFiltradas: Receta[] = [];

  atenciones: Atencion[] = [];
  citas: Cita[] = [];
  mascotas: Mascota[] = [];

  filtro = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly recetasService: Recetas,
    private readonly atencionesService: Atenciones,
    private readonly citasService: Citas,
    private readonly mascotasService: Mascotas,
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarRecetas();
  }

  cargarCatalogos(): void {
    this.atencionesService.listar().subscribe({
      next: (atenciones) => {
        this.atenciones = atenciones;
      },
    });

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

  cargarRecetas(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recetasService.listar().subscribe({
      next: (recetas) => {
        this.recetas = recetas;
        this.recetasFiltradas = recetas;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las recetas.';

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  obtenerAtencion(id: number): Atencion | undefined {
    return this.atenciones.find(
      (atencion) => atencion.id === id,
    );
  }

  obtenerCita(atencionId: number): Cita | undefined {
    const atencion = this.obtenerAtencion(atencionId);

    if (!atencion) {
      return undefined;
    }

    return this.citas.find(
      (cita) => cita.id === atencion.cita,
    );
  }

  nombreMascota(atencionId: number): string {
    const cita = this.obtenerCita(atencionId);

    if (!cita) {
      return 'Mascota no disponible';
    }

    return (
      this.mascotas.find(
        (mascota) => mascota.id === cita.mascota,
      )?.nombre ?? 'Mascota no disponible'
    );
  }

  fechaAtencion(atencionId: number): string {
    const cita = this.obtenerCita(atencionId);

    if (!cita) {
      return '—';
    }

    return `${cita.fecha} ${cita.hora.slice(0, 5)}`;
  }

  buscar(valor: string): void {
    this.filtro = valor.trim().toLowerCase();

    if (!this.filtro) {
      this.recetasFiltradas = this.recetas;
      return;
    }

    this.recetasFiltradas = this.recetas.filter(
      (receta) => {
        const contenido = [
          this.nombreMascota(receta.atencion),
          receta.medicamentos,
          receta.indicaciones,
        ]
          .join(' ')
          .toLowerCase();

        return contenido.includes(this.filtro);
      },
    );
  }

  eliminar(receta: Receta): void {
    const confirmado = window.confirm(
      `¿Eliminar la receta de ${this.nombreMascota(receta.atencion)}?`,
    );

    if (!confirmado) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.recetasService.eliminar(receta.id).subscribe({
      next: () => {
        this.successMessage =
          'Receta eliminada correctamente.';

        this.cargarRecetas();
      },
      error: (error) => {
        this.errorMessage =
          error.status === 403
            ? 'No tienes permisos para eliminar recetas.'
            : 'No fue posible eliminar la receta.';
      },
    });
  }
}