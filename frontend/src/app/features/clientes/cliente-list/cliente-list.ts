import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Cliente } from '../../../core/models/cliente.model';
import { Clientes } from '../../../core/services/clientes';

@Component({
  selector: 'app-cliente-list',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  filtro = '';

  constructor(
    private readonly clientesService: Clientes,
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientesService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage =
            'La sesión expiró. Inicia sesión nuevamente.';
          return;
        }

        this.errorMessage =
          'No fue posible cargar los clientes.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  buscar(valor: string): void {
    this.filtro = valor.trim().toLowerCase();

    if (!this.filtro) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    this.clientesFiltrados = this.clientes.filter((cliente) => {
      const contenido = [
        cliente.nombres,
        cliente.apellidos,
        cliente.documento,
        cliente.telefono,
        cliente.correo,
      ]
        .join(' ')
        .toLowerCase();

      return contenido.includes(this.filtro);
    });
  }

  eliminar(cliente: Cliente): void {
    const confirmado = window.confirm(
      `¿Deseas eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?`,
    );

    if (!confirmado) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.clientesService.eliminar(cliente.id).subscribe({
      next: () => {
        this.successMessage =
          'Cliente eliminado correctamente.';
        this.cargarClientes();
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage =
            'No tienes permisos para eliminar clientes.';
          return;
        }

        this.errorMessage =
          'No fue posible eliminar el cliente.';
      },
    });
  }
}