export interface Atencion {
  id: number;
  motivo: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  cita: number;
}

export type AtencionPayload = Omit<Atencion, 'id'>;