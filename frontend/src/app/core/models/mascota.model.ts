export type SexoMascota = 'M' | 'F';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: SexoMascota;
  fecha_nacimiento: string;
  peso: number;
  cliente: number;
}

export type MascotaPayload = Omit<Mascota, 'id'>;