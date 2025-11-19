export interface Programador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcion: string;
  proyectos: Proyecto[];
}

export interface Proyecto{
    id: number;
    titulo: string;
    descripcion: string;
    tecnologias: string[];
}

