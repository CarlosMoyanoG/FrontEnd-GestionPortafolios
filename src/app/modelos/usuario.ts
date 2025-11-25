export type RolUsuario = 'visitante' | 'admin' | 'programador';

export interface Usuario {
  id: number;
  nombre: string;
  email?: string;
  rol: RolUsuario;
  programadorId?: number;
  fotoUrl?: string;
}
