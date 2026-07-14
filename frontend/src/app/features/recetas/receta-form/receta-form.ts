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

import { Atencion } from '../../../core/models/atencion.model';
import { Cita } from '../../../core/models/cita.model';
import { Mascota } from '../../../core/models/mascota.model';
import { RecetaPayload } from '../../../core/models/receta.model';

import { Atenciones } from '../../../core/services/atenciones';
import { Citas } from '../../../core/services/citas';
import { Mascotas } from '../../../core/services/mascotas';
import { Recetas } from '../../../core/services/recetas';

@Component({
  selector: 'app-receta-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './receta-form.html',
  styleUrl: './receta-form.css',
})
export class RecetaForm implements OnInit {
  recetaId: number | null = null;

  atenciones: Atencion[] = [];
  citas: Cita[] = [];
  mascotas: Mascota[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly formulario;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly recetasService: Recetas,
    private readonly atencionesService: Atenciones,
    private readonly citasService: Citas,
    private readonly mascotasService: Mascotas,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.formulario =
      this.formBuilder.nonNullable.group({
        atencion: [
          0,
          [
            Validators.required,
            Validators.min(1),
          ],
        ],

        medicamentos: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
          ],
        ],

        indicaciones: [
          '',
          Validators.required,
        ],
      });
  }

  get esEdicion(): boolean {
    return this.recetaId !== null;
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
      this.router.navigate(['/recetas']);
      return;
    }

    this.recetaId = id;
    this.cargarReceta(id);
  }

  cargarCatalogos(): void {
    this.atencionesService.listar().subscribe({
      next: (atenciones) => {
        this.atenciones = atenciones;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las atenciones.';
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

  cargarReceta(id: number): void {
    this.isLoading = true;

    this.recetasService.obtener(id).subscribe({
      next: (receta) => {
        this.formulario.patchValue({
          atencion: receta.atencion,
          medicamentos: receta.medicamentos,
          indicaciones: receta.indicaciones,
        });
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar la receta.';

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  descripcionAtencion(atencion: Atencion): string {
    const cita = this.citas.find(
      (item) => item.id === atencion.cita,
    );

    const mascota = this.mascotas.find(
      (item) => item.id === cita?.mascota,
    );

    const fecha = cita
      ? `${cita.fecha} ${cita.hora.slice(0, 5)}`
      : 'Fecha no disponible';

    return `${fecha} — ${mascota?.nombre ?? 'Mascota'}`;
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload: RecetaPayload =
      this.formulario.getRawValue();

    const request$ = this.esEdicion
      ? this.recetasService.actualizar(
          this.recetaId!,
          payload,
        )
      : this.recetasService.crear(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/recetas']);
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
      return 'No tienes permisos para guardar recetas.';
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

    return 'No fue posible guardar la receta.';
  }
}