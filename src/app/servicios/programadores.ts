import { Injectable } from '@angular/core';
import { Programador } from '../modelos/programador';

@Injectable({
  providedIn: 'root',
})
export class Programadores {

  private programadores: Programador[] = [
    {
      id: 1,
      nombre: 'Paz Guerrero',
      especialidad: 'Frontend con Angular',
      descripcion: 'Desarrollo de SPA, maquetación responsive y consumo de APIs REST.',
      proyectos: [
        {
          id: 1,
          titulo: 'Panel administrativo',
          descripcion: 'Dashboard para gestión de ventas.',
          tecnologias: ['Angular', 'Tailwind', 'Firebase'],
        }
      ]
    },
    {
      id: 2,
      nombre: 'Carlos López',
      especialidad: 'Backend con Node.js',
      descripcion: 'Creación de APIs, autenticación y bases de datos.',
      proyectos: [
        {
          id: 2,
          titulo: 'API para e-commerce',
          descripcion: 'Manejo de productos, usuarios y pedidos.',
          tecnologias: ['Node', 'Express', 'MongoDB']
        }
      ]
    }
  ];

  private ultimoId = 2;

  getProgramadores(): Programador[] {
    return this.programadores;
  }

  getProgramadorById(id: number): Programador | undefined {
    return this.programadores.find(p => p.id === id);
  }

  crearProgramador(data: Omit<Programador, 'id'>): Programador {
    this.ultimoId++;
    const nuevoProg: Programador = {id: this.ultimoId,...data};
    this.programadores.push(nuevoProg);
    console.log('Programador creado:', nuevoProg);
    return nuevoProg;
  }

  eliminarProgramador(id: number): void {
    const listaTemporal: Programador[] = [];
    
    for (let i = 0; i < this.programadores.length; i++) {
      const programador = this.programadores[i];

      if (programador.id !== id) {
        listaTemporal.push(programador);
      }
    }

    this.programadores = listaTemporal;
  }
}
