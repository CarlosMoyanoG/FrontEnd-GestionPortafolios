import { EstadoAsesoria } from './asesoria';

export interface FiltroReporte {
  fechaInicio?: string;
  fechaFin?: string;
  programadorId?: number;
  estado?: EstadoAsesoria;
}
