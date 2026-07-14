import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Cita } from '../../../core/models/cita.model';
import { Mascota } from '../../../core/models/mascota.model';
import { Veterinario } from '../../../core/models/veterinario.model';

import { Citas } from '../../../core/services/citas';
import { Mascotas } from '../../../core/services/mascotas';
import { Veterinarios } from '../../../core/services/veterinarios';

@Component({
  selector: 'app-cita-list',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css',
})
export class CitaList implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];

  mascotas: Mascota[] = [];
  veterinarios: Veterinario[] = [];

  filtro = '';
  estadoSeleccionado = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly citasService: Citas,
    private readonly mascotasService: Mascotas,
    private readonly veterinariosService: Veterinarios,
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarCitas();
  }

  cargarCatalogos(): void {
    this.mascotasService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
      },
    });

    this.veterinariosService.listar().subscribe({
      next: (veterinarios) => {
        this.veterinarios = veterinarios;
      },
    });
  }

  cargarCitas(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.citasService.listar().subscribe({
      next: (citas) => {
        this.citas = [...citas].sort(
          (a, b) =>
            `${a.fecha} ${a.hora}`.localeCompare(
              `${b.fecha} ${b.hora}`,
            ),
        );

        this.aplicarFiltros();
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las citas.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  nombreMascota(id: number): string {
    return (
      this.mascotas.find(
        (mascota) => mascota.id === id,
      )?.nombre ?? 'Mascota no disponible'
    );
  }

  nombreVeterinario(id: number): string {
    const veterinario = this.veterinarios.find(
      (item) => item.id === id,
    );

    if (!veterinario) {
      return 'Veterinario no disponible';
    }

    return `${veterinario.nombres} ${veterinario.apellidos}`;
  }

  buscar(valor: string): void {
    this.filtro = valor
      .trim()
      .toLowerCase();

    this.aplicarFiltros();
  }

  filtrarEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.citasFiltradas = this.citas.filter(
      (cita) => {
        const coincideEstado =
          !this.estadoSeleccionado ||
          cita.estado === this.estadoSeleccionado;

        const contenido = [
          cita.fecha,
          cita.hora,
          cita.estado,
          this.nombreMascota(cita.mascota),
          this.nombreVeterinario(
            cita.veterinario,
          ),
        ]
          .join(' ')
          .toLowerCase();

        const coincideTexto =
          !this.filtro ||
          contenido.includes(this.filtro);

        return coincideEstado && coincideTexto;
      },
    );
  }

  eliminar(cita: Cita): void {
    const confirmado = window.confirm(
      `¿Eliminar la cita del ${cita.fecha} a las ${cita.hora}?`,
    );

    if (!confirmado) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.citasService.eliminar(cita.id).subscribe({
      next: () => {
        this.successMessage =
          'Cita eliminada correctamente.';
        this.cargarCitas();
      },
      error: (error) => {
        this.errorMessage =
          error.status === 403
            ? 'No tienes permisos para eliminar citas.'
            : 'No fue posible eliminar la cita.';
      },
    });
  }
}