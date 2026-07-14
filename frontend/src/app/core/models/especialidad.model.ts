export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

export type EspecialidadPayload = Omit<Especialidad, 'id'>;