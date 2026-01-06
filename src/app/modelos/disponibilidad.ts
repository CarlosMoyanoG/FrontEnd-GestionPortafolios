export type TipoDisponibilidad = 'recurrente' | 'bloqueo' | 'puntual';

export interface Disponibilidad {
  id: number;
  programadorId: number;
  tipo: TipoDisponibilidad;
  modalidad?: 'virtual' | 'presencial';

  diaSemana?: number;
  fecha?: string; 
  horaInicio?: string; 
  horaFin?: string;    
  hora?: string;
}
