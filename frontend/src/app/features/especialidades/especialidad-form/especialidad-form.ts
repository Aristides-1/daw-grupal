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

import { Especialidades } from '../../../core/services/especialidades';

@Component({
  selector: 'app-especialidad-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './especialidad-form.html',
  styleUrl: './especialidad-form.css',
})
export class EspecialidadForm implements OnInit {
  especialidadId: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly formulario;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly especialidadesService: Especialidades,
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
      descripcion: [''],
    });
  }

  get esEdicion(): boolean {
    return this.especialidadId !== null;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id > 0) {
      this.especialidadId = id;
      this.cargar(id);
    }
  }

  cargar(id: number): void {
    this.isLoading = true;

    this.especialidadesService.obtener(id).subscribe({
      next: (especialidad) => {
        this.formulario.patchValue(especialidad);
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar la especialidad.';
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

    const request$ = this.esEdicion
      ? this.especialidadesService.actualizar(
          this.especialidadId!,
          this.formulario.getRawValue(),
        )
      : this.especialidadesService.crear(
          this.formulario.getRawValue(),
        );

    request$.subscribe({
      next: () => {
        this.router.navigate(['/especialidades']);
      },
      error: () => {
        this.errorMessage =
          'No fue posible guardar la especialidad.';
        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }
}