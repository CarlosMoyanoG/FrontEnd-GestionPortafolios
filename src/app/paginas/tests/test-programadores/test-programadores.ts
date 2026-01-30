import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programador } from '../../../modelos/programador';
import { GestionProgramador } from '../../../servicios/servicios-gestiones/gestion-programador';

@Component({
  selector: 'app-test-programadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-programadores.html',
  styleUrl: './test-programadores.scss',
})
export class TestProgramadores implements OnInit {
  programadores: Programador[] = [];
  cargando = false;
  mensaje = '';
  error = '';
  enEdicion = false;

  programador: Programador = {
    id: 0,
    nombre: '',
    especialidad: '',
    descripcion: '',
    fotoUrl: '',
    emailContacto: '',
    githubUrl: '',
    linkedinUrl: '',
    sitioWeb: '',
    duenioUid: '',
    proyectos: [],
  };

  constructor(private programadorService: GestionProgramador) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.programadorService.listar().subscribe({
      next: (data) => (this.programadores = data),
      error: () => (this.error = 'No se pudo cargar programadores.'),
      complete: () => (this.cargando = false),
    });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';
    const payload: Programador = {
      ...this.programador,
      id: Number(this.programador.id),
    };

    if (!this.enEdicion) {
      delete (payload as Partial<Programador>).id;
    }

    const accion = this.enEdicion
      ? this.programadorService.actualizar(payload)
      : this.programadorService.crear(payload);

    accion.subscribe({
      next: () => {
        this.mensaje = this.enEdicion
          ? 'Programador actualizado.'
          : 'Programador creado.';
        this.limpiar();
        this.cargar();
      },
      error: () => (this.error = 'Error al guardar programador.'),
    });
  }

  editar(programador: Programador): void {
    this.programador = { ...programador };
    this.enEdicion = true;
  }

  eliminar(id: number): void {
    this.mensaje = '';
    this.error = '';
    this.programadorService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Programador eliminado.';
        this.cargar();
      },
      error: () => (this.error = 'Error al eliminar programador.'),
    });
  }

  limpiar(): void {
    this.programador = {
      id: 0,
      nombre: '',
      especialidad: '',
      descripcion: '',
      fotoUrl: '',
      emailContacto: '',
      githubUrl: '',
      linkedinUrl: '',
      sitioWeb: '',
      duenioUid: '',
      proyectos: [],
    };
    this.enEdicion = false;
  }
}
