export type EstadoCita =
  | 'pendiente'
  | 'confirmada'
  | 'atendida'
  | 'cancelada';

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  mascota: number;
  veterinario: number;
}

export type CitaPayload = Omit<Cita, 'id'>;