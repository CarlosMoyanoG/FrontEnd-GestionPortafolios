export type EstadoAsesoria = 'pendiente' | 'aprobada' | 'rechazada';
export type TipoDisponibilidad = 'recurrente' | 'bloqueo';
export type ModalidadDisponibilidad = 'virtual' | 'presencial';
export type RolUsuario = 'visitante' | 'admin' | 'programador';
export type TipoSeccionProyecto = 'academico' | 'laboral';
export type TipoParticipacion =
  | 'Frontend'
  | 'Backend'
  | 'Base de Datos'
  | 'Fullstack';

export interface Asesoria {
  id: number;
  programadorId?: number | null;
  nombreCliente: string;
  emailCliente: string;
  fecha: string;
  hora: string;
  descripcionProyecto: string;
  estado: EstadoAsesoria;
  mensajeRespuesta?: string | null;
}

export interface Disponibilidad {
  id: number;
  programadorId?: number | null;
  tipo: TipoDisponibilidad;
  diaSemana?: number | null;
  fecha?: string | null;
  hora?: string | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  modalidad?: ModalidadDisponibilidad | null;
}

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  seccion: TipoSeccionProyecto;
  participacion: TipoParticipacion;
  tecnologias: string[];
  repoUrl?: string | null;
  demoUrl?: string | null;
}

export interface Programador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcion: string;
  fotoUrl?: string | null;
  emailContacto?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  sitioWeb?: string | null;
  duenioUid?: string | null;
  proyectos?: Proyecto[];
}

export interface Usuario {
  id: number;
  nombre: string;
  email?: string | null;
  fotoUrl?: string | null;
  rol: RolUsuario;
  programadorId?: number | null;
}

export interface ApiError {
  codigo: string;
  name: string;
  description: string;
}
