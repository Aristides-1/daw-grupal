import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Cliente } from '../../../core/models/cliente.model';
import { Mascota } from '../../../core/models/mascota.model';
import { Clientes } from '../../../core/services/clientes';
import { Mascotas } from '../../../core/services/mascotas';

@Component({
  selector: 'app-mascota-list',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './mascota-list.html',
  styleUrl: './mascota-list.css',
})
export class MascotaList implements OnInit {
  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  clientes: Cliente[] = [];

  filtro = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly mascotasService: Mascotas,
    private readonly clientesService: Clientes,
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarMascotas();
  }

  cargarClientes(): void {
    this.clientesService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
    });
  }

  cargarMascotas(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.mascotasService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
        this.mascotasFiltradas = mascotas;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las mascotas.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  nombreCliente(clienteId: number): string {
    const cliente = this.clientes.find(
      (item) => item.id === clienteId,
    );

    if (!cliente) {
      return 'Propietario no disponible';
    }

    return `${cliente.nombres} ${cliente.apellidos}`;
  }

  buscar(valor: string): void {
    this.filtro = valor.trim().toLowerCase();

    if (!this.filtro) {
      this.mascotasFiltradas = this.mascotas;
      return;
    }

    this.mascotasFiltradas = this.mascotas.filter(
      (mascota) => {
        const contenido = [
          mascota.nombre,
          mascota.especie,
          mascota.raza,
          this.nombreCliente(mascota.cliente),
        ]
          .join(' ')
          .toLowerCase();

        return contenido.includes(this.filtro);
      },
    );
  }

  eliminar(mascota: Mascota): void {
    const confirmado = window.confirm(
      `¿Deseas eliminar a ${mascota.nombre}?`,
    );

    if (!confirmado) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.mascotasService.eliminar(mascota.id).subscribe({
      next: () => {
        this.successMessage =
          'Mascota eliminada correctamente.';
        this.cargarMascotas();
      },
      error: (error) => {
        this.errorMessage =
          error.status === 403
            ? 'No tienes permisos para eliminar mascotas.'
            : 'No fue posible eliminar la mascota.';
      },
    });
  }
}