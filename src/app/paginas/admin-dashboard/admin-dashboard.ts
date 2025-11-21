import { Component } from '@angular/core';
import { Asesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})

export class AdminDashboard {
  asesorias: any[] = [];
  programadores: any[] = [];

  nuevoProgramador = {
    nombre: '',
    especialidad: '',
    descripcion: ''
  };

  constructor(private asesoriasService: Asesorias, private programadoresService: Programadores){
    this.programadores = this.programadoresService.getProgramadores();
    const listaAsesorias = this.asesoriasService.getAsesorias();

    this.asesorias = listaAsesorias.map(asesoria => {
      const programadorEncontrado = this.programadores.find(p => p.id === asesoria.programadorId);
      return {
        ...asesoria,
        programadorNombre: programadorEncontrado ? programadorEncontrado.nombre : 'Sin Asignar'
      };
    });

    console.log('Asesorías:', this.asesorias);

  } 

  crearProgramador() {
    if (!this.nuevoProgramador.nombre || !this.nuevoProgramador.especialidad) {
      alert('Nombre y especialidad son obligatorios');
      return;
    }

    this.programadoresService.crearProgramador({
      nombre: this.nuevoProgramador.nombre,
      especialidad: this.nuevoProgramador.especialidad,
      descripcion: this.nuevoProgramador.descripcion,
      proyectos: []
    });

    this.programadores = this.programadoresService.getProgramadores();

    this.nuevoProgramador = {
      nombre: '',
      especialidad: '',
      descripcion: ''
    };
  }
} 

