import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Asesoria, EstadoAsesoria } from '../../../modelos/asesoria';
import { GestionAsesoria } from '../../../servicios/servicios-gestiones/gestion-asesoria';

@Component({
  selector: 'app-test-asesorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-asesorias.html',
  styleUrl: './test-asesorias.scss',
})
export class TestAsesorias implements OnInit {
  asesorias: Asesoria[] = [];
  estados: EstadoAsesoria[] = ['pendiente', 'aprobada', 'rechazada'];
  cargando = false;
  mensaje = '';
  error = '';
  enEdicion = false;

  asesoria: Asesoria = {
    id: 0,
    programadorId: undefined,
    nombreCliente: '',
    emailCliente: '',
    fecha: '',
    hora: '',
    descripcionProyecto: '',
    estado: 'pendiente',
    mensajeRespuesta: '',
  };

  constructor(private asesoriaService: GestionAsesoria) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.asesoriaService.listar().subscribe({
      next: (data) => (this.asesorias = data),
      error: () => (this.error = 'No se pudo cargar asesorias.'),
      complete: () => (this.cargando = false),
    });

    console.log('Cargando asesorias...');
    console.log(this.asesorias);
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';
    const id =
      this.asesoria.id != null && this.asesoria.id !== ('' as any)
        ? Number(this.asesoria.id)
        : undefined;
    const payload: Asesoria = {
      ...this.asesoria,
      id,
      programadorId:
        this.asesoria.programadorId != null && this.asesoria.programadorId !== ('' as any)
          ? Number(this.asesoria.programadorId)
          : undefined,
    };

    if (!this.enEdicion) {
      delete (payload as Partial<Asesoria>).id;
    }

    const accion = this.enEdicion
      ? this.asesoriaService.actualizar(payload)
      : this.asesoriaService.crear(payload);

    accion.subscribe({
      next: () => {
        this.mensaje = this.enEdicion ? 'Asesoria actualizada.' : 'Asesoria creada.';
        this.limpiar();
        this.cargar();
      },
      error: () => (this.error = 'Error al guardar asesoria.'),
    });
  }

  editar(asesoria: Asesoria): void {
    this.asesoria = { ...asesoria };
    this.enEdicion = true;
  }

  eliminar(id?: number): void {
    this.mensaje = '';
    this.error = '';
    if (id == null) return;
    this.asesoriaService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Asesoria eliminada.';
        this.cargar();
      },
      error: () => (this.error = 'Error al eliminar asesoria.'),
    });
  }

  limpiar(): void {
    this.asesoria = {
      id: 0,
      programadorId: undefined,
      nombreCliente: '',
      emailCliente: '',
      fecha: '',
      hora: '',
      descripcionProyecto: '',
      estado: 'pendiente',
      mensajeRespuesta: '',
    };
    this.enEdicion = false;
  }
}
