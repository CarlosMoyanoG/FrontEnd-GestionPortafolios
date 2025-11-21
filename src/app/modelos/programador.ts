export interface Programador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcion: string;
  proyectos: Proyecto[];
}

// FALTA FOTO DE PERFIL, ENLACES DE CONTACTO Y REDES SOCIALES

export interface Proyecto{
    id: number;
    titulo: string;
    descripcion: string;
    tecnologias: string[];
}

// FALTA ENLACES REPOS Y ENLACES A DESPLIEGUES

