export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  direccion: string;
}

export type ClientePayload = Omit<Cliente, 'id'>;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}