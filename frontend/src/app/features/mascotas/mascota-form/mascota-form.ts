import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';

import { Cliente } from '../../../core/models/cliente.model';
import {
  MascotaPayload,
  SexoMascota,
} from '../../../core/models/mascota.model';
import { Clientes } from '../../../core/services/clientes';
import { Mascotas } from '../../../core/services/mascotas';

@Component({
  selector: 'app-mascota-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.css',
})
export class MascotaForm implements OnInit {
  mascotaId: number | null = null;
  clientes: Cliente[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly formulario;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly mascotasService: Mascotas,
    private readonly clientesService: Clientes,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.formulario = this.formBuilder.nonNullable.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      especie: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      raza: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      sexo: this.formBuilder.nonNullable.control<SexoMascota>(
        'M',
        Validators.required,
      ),
      fecha_nacimiento: [
        '',
        Validators.required,
      ],
      peso: [
        0,
        [
          Validators.required,
          Validators.min(0.01),
        ],
      ],
      cliente: [
        0,
        [
          Validators.required,
          Validators.min(1),
        ],
      ],
    });
  }

  get esEdicion(): boolean {
    return this.mascotaId !== null;
  }

  ngOnInit(): void {
    this.cargarClientes();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.router.navigate(['/mascotas']);
      return;
    }

    this.mascotaId = id;
    this.cargarMascota(id);
  }

  cargarClientes(): void {
    this.clientesService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar los propietarios.';
      },
    });
  }

  cargarMascota(id: number): void {
    this.isLoading = true;

    this.mascotasService.obtener(id).subscribe({
      next: (mascota) => {
        this.formulario.patchValue({
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza,
          sexo: mascota.sexo,
          fecha_nacimiento: mascota.fecha_nacimiento,
          peso: mascota.peso,
          cliente: mascota.cliente,
        });
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar la mascota.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload: MascotaPayload =
      this.formulario.getRawValue();

    const request$ = this.esEdicion
      ? this.mascotasService.actualizar(
          this.mascotaId!,
          payload,
        )
      : this.mascotasService.crear(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/mascotas']);
      },
      error: (error) => {
        this.errorMessage =
          error.status === 400
            ? this.obtenerMensajeBackend(error.error)
            : 'No fue posible guardar la mascota.';

        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);

    return Boolean(
      control &&
      control.invalid &&
      (control.touched || control.dirty),
    );
  }

  private obtenerMensajeBackend(
    errores: Record<string, unknown>,
  ): string {
    const campo = Object.keys(errores ?? {})[0];

    if (!campo) {
      return 'Los datos enviados no son válidos.';
    }

    const detalle = errores[campo];

    if (Array.isArray(detalle) && detalle.length > 0) {
      return `${campo}: ${detalle[0]}`;
    }

    return 'Revisa los datos ingresados.';
  }
}