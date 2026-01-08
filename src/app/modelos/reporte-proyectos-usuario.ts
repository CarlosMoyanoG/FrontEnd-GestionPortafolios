export interface ReporteProyectosUsuario {
  usuarioUid: string;
  nombreUsuario: string;
  email?: string;
  programadorId?: number;
  totalProyectos: number;
  proyectosActivos: number;
}
