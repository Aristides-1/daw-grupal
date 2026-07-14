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

import {
  AtencionPayload,
} from '../../../core/models/atencion.model';

import { Cita } from '../../../core/models/cita.model';
import { Mascota } from '../../../core/models/mascota.model';

import { Atenciones } from '../../../core/services/atenciones';
import { Citas } from '../../../core/services/citas';
import { Mascotas } from '../../../core/services/mascotas';

@Component({
  selector: 'app-atencion-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './atencion-form.html',
  styleUrl: './atencion-form.css',
})
export class AtencionForm implements OnInit {
  atencionId: number | null = null;

  citas: Cita[] = [];
  mascotas: Mascota[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly formulario;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly atencionesService: Atenciones,
    private readonly citasService: Citas,
    private readonly mascotasService: Mascotas,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.formulario =
      this.formBuilder.nonNullable.group({
        cita: [
          0,
          [
            Validators.required,
            Validators.min(1),
          ],
        ],

        motivo: [
          '',
          Validators.required,
        ],

        sintomas: [''],

        diagnostico: [
          '',
          Validators.required,
        ],

        tratamiento: [
          '',
          Validators.required,
        ],

        observaciones: [''],
      });
  }

  get esEdicion(): boolean {
    return this.atencionId !== null;
  }

  ngOnInit(): void {
    this.cargarCatalogos();

    const idParam =
      this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.router.navigate(['/atenciones']);
      return;
    }

    this.atencionId = id;
    this.cargarAtencion(id);
  }

  cargarCatalogos(): void {
    this.citasService.listar().subscribe({
      next: (citas) => {
        this.citas = citas.filter(
          (cita) => cita.estado !== 'cancelada',
        );
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las citas.';
      },
    });

    this.mascotasService.listar().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
      },
    });
  }

  cargarAtencion(id: number): void {
    this.isLoading = true;

    this.atencionesService.obtener(id).subscribe({
      next: (atencion) => {
        this.formulario.patchValue({
          cita: atencion.cita,
          motivo: atencion.motivo,
          sintomas: atencion.sintomas,
          diagnostico: atencion.diagnostico,
          tratamiento: atencion.tratamiento,
          observaciones: atencion.observaciones,
        });
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar la atención.';

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  descripcionCita(cita: Cita): string {
    const mascota = this.mascotas.find(
      (item) => item.id === cita.mascota,
    );

    return `${cita.fecha} ${cita.hora.slice(0, 5)} — ${
      mascota?.nombre ?? 'Mascota'
    }`;
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload: AtencionPayload =
      this.formulario.getRawValue();

    const request$ = this.esEdicion
      ? this.atencionesService.actualizar(
          this.atencionId!,
          payload,
        )
      : this.atencionesService.crear(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/atenciones']);
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
      return 'No tienes permisos para guardar atenciones.';
    }

    if (
      typeof error === 'object' &&
      error !== null
    ) {
      const errores =
        error as Record<string, unknown>;

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

    return 'No fue posible guardar la atención.';
  }
}