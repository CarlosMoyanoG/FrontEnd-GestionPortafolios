import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Disponibilidad, TipoDisponibilidad } from '../../../modelos/disponibilidad';
import { GestionDisponibilidad } from '../../../servicios/servicios-gestiones/gestion-disponibilidad';

@Component({
  selector: 'app-test-disponibilidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-disponibilidades.html',
  styleUrl: './test-disponibilidades.scss',
})
export class TestDisponibilidades implements OnInit {
  disponibilidades: Disponibilidad[] = [];
  tipos: TipoDisponibilidad[] = ['recurrente', 'bloqueo'];
  modalidades: Array<'virtual' | 'presencial'> = ['virtual', 'presencial'];
  cargando = false;
  mensaje = '';
  error = '';
  enEdicion = false;

  disponibilidad: Disponibilidad = {
    id: 0,
    programadorId: undefined,
    tipo: 'recurrente',
    diaSemana: undefined,
    fecha: '',
    hora: '',
    horaInicio: '',
    horaFin: '',
    modalidad: 'virtual',
  };

  constructor(private disponibilidadService: GestionDisponibilidad) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.disponibilidadService.listar().subscribe({
      next: (data) => (this.disponibilidades = data),
      error: () => (this.error = 'No se pudo cargar disponibilidades.'),
      complete: () => (this.cargando = false),
    });

    console.log('Cargando disponibilidades...');
    console.log(this.disponibilidades);
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';
    const id =
      this.disponibilidad.id != null && this.disponibilidad.id !== ('' as any)
        ? Number(this.disponibilidad.id)
        : undefined;
    const payload: Disponibilidad = {
      ...this.disponibilidad,
      id,
      programadorId:
        this.disponibilidad.programadorId != null && this.disponibilidad.programadorId !== ('' as any)
          ? Number(this.disponibilidad.programadorId)
          : undefined,
      diaSemana:
        this.disponibilidad.diaSemana != null && this.disponibilidad.diaSemana !== ('' as any)
          ? Number(this.disponibilidad.diaSemana)
          : undefined,
    };

    if (!this.enEdicion) {
      delete (payload as Partial<Disponibilidad>).id;
    }

    const accion = this.enEdicion
      ? this.disponibilidadService.actualizar(payload)
      : this.disponibilidadService.crear(payload);

    accion.subscribe({
      next: () => {
        this.mensaje = this.enEdicion
          ? 'Disponibilidad actualizada.'
          : 'Disponibilidad creada.';
        this.limpiar();
        this.cargar();
      },
      error: () => (this.error = 'Error al guardar disponibilidad.'),
    });
  }

  editar(disponibilidad: Disponibilidad): void {
    this.disponibilidad = { ...disponibilidad };
    this.enEdicion = true;
  }

  eliminar(id?: number): void {
    this.mensaje = '';
    this.error = '';
    if (id == null) return;
    this.disponibilidadService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Disponibilidad eliminada.';
        this.cargar();
      },
      error: () => (this.error = 'Error al eliminar disponibilidad.'),
    });
  }

  limpiar(): void {
    this.disponibilidad = {
      id: 0,
      programadorId: undefined,
      tipo: 'recurrente',
      diaSemana: undefined,
      fecha: '',
      hora: '',
      horaInicio: '',
      horaFin: '',
      modalidad: 'virtual',
    };
    this.enEdicion = false;
  }
}
