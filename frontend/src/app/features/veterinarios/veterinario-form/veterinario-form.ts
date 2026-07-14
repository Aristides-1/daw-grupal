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

import { Especialidad } from '../../../core/models/especialidad.model';
import { Especialidades } from '../../../core/services/especialidades';
import { Veterinarios } from '../../../core/services/veterinarios';

@Component({
  selector: 'app-veterinario-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './veterinario-form.html',
  styleUrl: './veterinario-form.css',
})
export class VeterinarioForm implements OnInit {
  veterinarioId: number | null = null;
  especialidades: Especialidad[] = [];
  isSaving = false;
  errorMessage = '';

  readonly formulario;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly veterinariosService: Veterinarios,
    private readonly especialidadesService: Especialidades,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.formulario = this.formBuilder.nonNullable.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      especialidad: this.formBuilder.control<number | null>(
        null,
      ),
    });
  }

  get esEdicion(): boolean {
    return this.veterinarioId !== null;
  }

  ngOnInit(): void {
    this.especialidadesService.listar().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id > 0) {
      this.veterinarioId = id;
      this.cargar(id);
    }
  }

  cargar(id: number): void {
    this.veterinariosService.obtener(id).subscribe({
      next: (veterinario) => {
        this.formulario.patchValue(veterinario);
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar el veterinario.';
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
      ? this.veterinariosService.actualizar(
          this.veterinarioId!,
          this.formulario.getRawValue(),
        )
      : this.veterinariosService.crear(
          this.formulario.getRawValue(),
        );

    request$.subscribe({
      next: () => {
        this.router.navigate(['/veterinarios']);
      },
      error: (error) => {
        this.errorMessage =
          error.status === 403
            ? 'No tienes permisos para guardar veterinarios.'
            : 'No fue posible guardar el veterinario.';

        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }
}