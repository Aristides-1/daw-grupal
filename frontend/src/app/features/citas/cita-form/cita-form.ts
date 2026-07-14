import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

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

import {
  CitaPayload,
  EstadoCita,
} from '../../../core/models/cita.model';

import { Mascota } from '../../../core/models/mascota.model';
import { Veterinario } from '../../../core/models/veterinario.model';

import { Citas } from '../../../core/services/citas';
import { Mascotas } from '../../../core/services/mascotas';
import { Veterinarios } from '../../../core/services/veterinarios';

@Component({
  selector: 'app-cita-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './cita-form.html',
  styleUrl: './cita-form.css',
})
export class CitaForm implements OnInit {
  citaId: number | null = null;

  mascotas: Mascota[] = [];
  veterinarios: Veterinario[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly fechaMinima =
    new Date().toISOString().split('T')[0];

  readonly formulario;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly citasService: Citas,
    private readonly mascotasService: Mascotas,
    private readonly veterinariosService: Veterinarios,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.formulario =
      this.formBuilder.nonNullable.group({
        fecha: [
          '',
          Validators.required,
        ],

        hora: [
          '',
          Validators.required,
        ],

        estado:
          this.formBuilder.nonNullable.control<EstadoCita>(
            'pendiente',
            Validators.required,
          ),

        mascota: [
          0,
          [
            Validators.required,
            Validators.min(1),
          ],
        ],

        veterinario: [
          0,
          [
            Validators.required,
            Validators.min(1),
          ],
        ],
      });
  }

  get esEdicion(): boolean {
    return this.citaId !== null;
  }

  ngOnInit(): void {
    this.cargarCatalogos();

    const idParam =
      this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.router.navigate(['/citas']);
      return;
    }

    this.citaId = id;
    this.cargarCita(id);
  }

  cargarCatalogos(): void {
    this.mascotasService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las mascotas.';
      },
    });

    this.veterinariosService.listar().subscribe({
      next: (veterinarios) => {
        this.veterinarios = veterinarios;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar los veterinarios.';
      },
    });
  }

  cargarCita(id: number): void {
    this.isLoading = true;

    this.citasService.obtener(id).subscribe({
      next: (cita) => {
        this.formulario.patchValue({
          fecha: cita.fecha,
          hora: cita.hora.slice(0, 5),
          estado: cita.estado,
          mascota: cita.mascota,
          veterinario: cita.veterinario,
        });
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar la cita.';
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

    const payload: CitaPayload =
      this.formulario.getRawValue();

    const request$ = this.esEdicion
      ? this.citasService.actualizar(
          this.citaId!,
          payload,
        )
      : this.citasService.crear(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/citas']);
      },
      error: (error) => {
        this.errorMessage =
          this.obtenerMensajeBackend(
            error.error,
            error.status,
          );

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
    error: unknown,
    status: number,
  ): string {
    if (status === 403) {
      return 'No tienes permisos para guardar citas.';
    }

    if (
      typeof error === 'object' &&
      error !== null
    ) {
      const errores =
        error as Record<string, unknown>;

      const nonFieldErrors =
        errores['non_field_errors'];

      if (
        Array.isArray(nonFieldErrors) &&
        nonFieldErrors.length > 0
      ) {
        return String(nonFieldErrors[0]);
      }

      const primerCampo =
        Object.keys(errores)[0];

      const detalle =
        errores[primerCampo];

      if (
        Array.isArray(detalle) &&
        detalle.length > 0
      ) {
        return `${primerCampo}: ${detalle[0]}`;
      }
    }

    return 'No fue posible guardar la cita.';
  }
}