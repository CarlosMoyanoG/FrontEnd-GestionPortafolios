import { EstadoAsesoria } from './asesoria';

export interface ReporteAsesoria {
  programadorId: number;
  nombreProgramador: string;
  fecha: string;
  estado: EstadoAsesoria;
  total: number;
}
