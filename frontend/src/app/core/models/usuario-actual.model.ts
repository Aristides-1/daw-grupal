export interface UsuarioActual {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  rol: number | null;
  rol_nombre: string | null;
  estado: boolean;
  is_superuser: boolean;
  es_administrador: boolean;
}