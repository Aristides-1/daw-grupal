export interface Veterinario {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  especialidad: number | null;
}

export type VeterinarioPayload = Omit<Veterinario, 'id'>;