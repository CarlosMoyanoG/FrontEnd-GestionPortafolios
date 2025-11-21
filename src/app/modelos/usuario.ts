export type RolUsuario = 'visitante' | 'admin' | 'programador';

export interface Usuario {
  id: number;
  nombre: string;
  rol: RolUsuario;
  programadorId?: number;
}
