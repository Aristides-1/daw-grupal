export interface Receta {
  id: number;
  medicamentos: string;
  indicaciones: string;
  atencion: number;
}

export type RecetaPayload = Omit<Receta, 'id'>;