import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proyecto, TipoParticipacion, TipoSeccionProyecto } from '../../../modelos/proyecto';
import { GestionProyecto } from '../../../servicios/servicios-gestiones/gestion-proyecto';

@Component({
  selector: 'app-test-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-proyectos.html',
  styleUrl: './test-proyectos.scss',
})
export class TestProyectos implements OnInit {
  proyectos: Proyecto[] = [];
  cargando = false;
  mensaje = '';
  error = '';
  enEdicion = false;
  tecnologiasTexto = '';
  secciones: TipoSeccionProyecto[] = ['academico', 'laboral'];
  participaciones: TipoParticipacion[] = ['Frontend', 'Backend', 'Base de Datos', 'Fullstack'];

  proyecto: Proyecto = {
    id: 0,
    nombre: '',
    descripcion: '',
    seccion: 'academico',
    participacion: 'Frontend',
    tecnologias: [],
    repoUrl: '',
    demoUrl: '',
  };

  constructor(private proyectoService: GestionProyecto) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.proyectoService.listar().subscribe({
      next: (data) => (this.proyectos = data),
      error: () => (this.error = 'No se pudo cargar proyectos.'),
      complete: () => (this.cargando = false),
    });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';
    const tecnologias = this.tecnologiasTexto
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Proyecto = {
      ...this.proyecto,
      id: Number(this.proyecto.id),
      tecnologias,
    };

    if (!this.enEdicion) {
      delete (payload as Partial<Proyecto>).id;
    }

    const accion = this.enEdicion
      ? this.proyectoService.actualizar(payload)
      : this.proyectoService.crear(payload);

    accion.subscribe({
      next: () => {
        this.mensaje = this.enEdicion ? 'Proyecto actualizado.' : 'Proyecto creado.';
        this.limpiar();
        this.cargar();
      },
      error: () => (this.error = 'Error al guardar proyecto.'),
    });
  }

  editar(proyecto: Proyecto): void {
    this.proyecto = { ...proyecto };
    this.tecnologiasTexto = (proyecto.tecnologias || []).join(', ');
    this.enEdicion = true;
  }

  eliminar(id: number): void {
    this.mensaje = '';
    this.error = '';
    this.proyectoService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Proyecto eliminado.';
        this.cargar();
      },
      error: () => (this.error = 'Error al eliminar proyecto.'),
    });
  }

  limpiar(): void {
    this.proyecto = {
      id: 0,
      nombre: '',
      descripcion: '',
      seccion: 'academico',
      participacion: 'Frontend',
      tecnologias: [],
      repoUrl: '',
      demoUrl: '',
    };
    this.tecnologiasTexto = '';
    this.enEdicion = false;
  }
}
