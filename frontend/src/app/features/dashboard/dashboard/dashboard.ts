import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Atenciones } from '../../../core/services/atenciones';
import { Citas } from '../../../core/services/citas';
import { Clientes } from '../../../core/services/clientes';
import { Mascotas } from '../../../core/services/mascotas';
import { Recetas } from '../../../core/services/recetas';
import { Veterinarios } from '../../../core/services/veterinarios';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalClientes = 0;
  totalMascotas = 0;
  totalVeterinarios = 0;
  totalCitas = 0;
  totalAtenciones = 0;
  totalRecetas = 0;

  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly clientesService: Clientes,
    private readonly mascotasService: Mascotas,
    private readonly veterinariosService: Veterinarios,
    private readonly citasService: Citas,
    private readonly atencionesService: Atenciones,
    private readonly recetasService: Recetas,
  ) {}

  ngOnInit(): void {
    this.cargarIndicadores();
  }

  cargarIndicadores(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      clientes: this.clientesService.listar(),
      mascotas: this.mascotasService.listar(),
      veterinarios: this.veterinariosService.listar(),
      citas: this.citasService.listar(),
      atenciones: this.atencionesService.listar(),
      recetas: this.recetasService.listar(),
    }).subscribe({
      next: (datos) => {
        this.totalClientes = datos.clientes.length;
        this.totalMascotas = datos.mascotas.length;
        this.totalVeterinarios = datos.veterinarios.length;
        this.totalCitas = datos.citas.length;
        this.totalAtenciones = datos.atenciones.length;
        this.totalRecetas = datos.recetas.length;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar todos los indicadores.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}