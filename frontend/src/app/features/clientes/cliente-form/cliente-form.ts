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

import { ClientePayload } from '../../../core/models/cliente.model';
import { Clientes } from '../../../core/services/clientes';

@Component({
  selector: 'app-cliente-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  clienteId: number | null = null;

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  readonly clienteForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clientesService: Clientes,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.clienteForm = this.formBuilder.nonNullable.group({
      nombres: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      documento: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      direccion: [
        '',
        Validators.required,
      ],
    });
  }

  get esEdicion(): boolean {
    return this.clienteId !== null;
  }

  ngOnInit(): void {
    const idParam =
      this.activatedRoute.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.router.navigate(['/clientes']);
      return;
    }

    this.clienteId = id;
    this.cargarCliente(id);
  }

  cargarCliente(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientesService.obtener(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          nombres: cliente.nombres,
          apellidos: cliente.apellidos,
          documento: cliente.documento,
          telefono: cliente.telefono,
          correo: cliente.correo,
          direccion: cliente.direccion,
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage =
          'No fue posible cargar el cliente.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  guardar(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const cliente: ClientePayload =
      this.clienteForm.getRawValue();

    const request$ = this.esEdicion
      ? this.clientesService.actualizar(
          this.clienteId!,
          cliente,
        )
      : this.clientesService.crear(cliente);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        this.isSaving = false;

        if (error.status === 400) {
          this.errorMessage =
            this.obtenerMensajeBackend(error.error);
          return;
        }

        this.errorMessage =
          'No fue posible guardar el cliente.';
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.clienteForm.get(campo);

    return Boolean(
      control &&
      control.invalid &&
      (control.touched || control.dirty),
    );
  }

  private obtenerMensajeBackend(
    errores: Record<string, unknown>,
  ): string {
    if (!errores || typeof errores !== 'object') {
      return 'Los datos enviados no son válidos.';
    }

    const primerCampo = Object.keys(errores)[0];
    const detalle = errores[primerCampo];

    if (Array.isArray(detalle) && detalle.length > 0) {
      return `${primerCampo}: ${detalle[0]}`;
    }

    return 'Revisa los datos ingresados.';
  }
}