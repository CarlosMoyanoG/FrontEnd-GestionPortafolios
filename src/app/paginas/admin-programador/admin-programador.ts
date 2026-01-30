import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programador } from '../../modelos/programador';
import { Asesoria, EstadoAsesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Autenticacion } from '../../servicios/autenticacion';
import {Proyecto,TipoParticipacion,TipoSeccionProyecto} from '../../modelos/proyecto';
import { Disponibilidades } from '../../servicios/disponibilidades';
import { Disponibilidad } from '../../modelos/disponibilidad';

@Component({
  selector: 'app-admin-programador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-programador.html',
  styleUrl: './admin-programador.scss',
})

export class AdminProgramador implements OnInit {
  mensajeExito = '';
  asesorias: Asesoria[] = [];
  programador: Programador | undefined;
  estadosPosibles: EstadoAsesoria[] = ['pendiente', 'aprobada', 'rechazada'];
  seccionActiva: 'perfil' | 'asesorias' | 'horarios' | 'proyectos' =
    'asesorias';
  resumenAsesorias = {
    total: 0,
    porEstado: [] as { estado: EstadoAsesoria; cantidad: number }[],
    porMes: [] as { etiqueta: string; cantidad: number }[],
    maxEstado: 1,
    maxMes: 1,
  };

  // Perfil
  perfilEditando = false;
  perfilForm = {
    nombre: '',
    especialidad: '',
    descripcion: '',
    fotoUrl: '',
    emailContacto: '',
    githubUrl: '',
    linkedinUrl: '',
    sitioWeb: '',
  };

  // Horarios propios
  horarios: Disponibilidad[] = [];
  diasSemana = [
    { valor: 1, etiqueta: 'Lunes' },
    { valor: 2, etiqueta: 'Martes' },
    { valor: 3, etiqueta: 'Miércoles' },
    { valor: 4, etiqueta: 'Jueves' },
    { valor: 5, etiqueta: 'Viernes' },
    { valor: 6, etiqueta: 'Sábado' },
    { valor: 0, etiqueta: 'Domingo' },
  ];

  formHorarioRecurrente = {
    diasSeleccionados: [] as number[],
    horaInicio: '',
    horaFin: '',
    modalidad: 'virtual' as 'virtual' | 'presencial',
  };

  formBloqueo = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    todoElDia: false,
    modalidad: 'virtual' as 'virtual' | 'presencial',
  };

  // Proyectos
  tecnologiasTexto = '';
  editandoProyectoId: number | null = null;
  tiposSeccion: TipoSeccionProyecto[] = ['academico', 'laboral'];
  tiposParticipacion: TipoParticipacion[] = [
    'Frontend',
    'Backend',
    'Base de Datos',
    'Fullstack',
  ];

  nuevoProyecto: Proyecto = {
    id: undefined,
    nombre: '',
    descripcion: '',
    seccion: 'academico',
    participacion: 'Frontend',
    tecnologias: [],
    repoUrl: '',
    demoUrl: '',
  };

  constructor(
    private programadorService: Programadores,
    private asesoriasService: Asesorias,
    private auth: Autenticacion,
    private disponibilidadesService: Disponibilidades
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  cambiarSeccion(
    seccion: 'perfil' | 'asesorias' | 'horarios' | 'proyectos'
  ) {
    this.seccionActiva = seccion;
  }

  //  Carga inicial

  private async cargarDatos(): Promise<void> {
    const programadorId = this.auth.usuarioActual.programadorId;
    if (programadorId == null) {
      this.programador = undefined;
      return;
    }

    this.programador = await this.programadorService.getProgramadorById(
      programadorId
    );
    const todas_asesorias = await this.asesoriasService.getAsesorias();

    if (this.programador) {
      const listaFiltrada: Asesoria[] = [];

      for (let i = 0; i < todas_asesorias.length; i++) {
        const asesoria = todas_asesorias[i];

        if (asesoria.programadorId === this.programador.id) {
          listaFiltrada.push(asesoria);
        }
      }

      this.asesorias = listaFiltrada;
      this.calcularResumenAsesorias();
      this.cargarPerfilForm();
      await this.cargarHorarios();
    }
  }

  private async cargarHorarios(): Promise<void> {
    if (!this.programador) return;
    this.horarios = await this.disponibilidadesService.getPorProgramador(
      this.programador.id
    );
  }

  private minutosDesdeHora(hora: string): number {
    const [h, m] = hora.split(':').map((n) => parseInt(n, 10));
    return h * 60 + m;
  }

  //  Perfil

  private cargarPerfilForm(): void {
    if (!this.programador) return;

    this.perfilForm = {
      nombre: this.programador.nombre,
      especialidad: this.programador.especialidad,
      descripcion: this.programador.descripcion,
      fotoUrl: this.programador.fotoUrl || '',
      emailContacto: this.programador.emailContacto || '',
      githubUrl: this.programador.githubUrl || '',
      linkedinUrl: this.programador.linkedinUrl || '',
      sitioWeb: this.programador.sitioWeb || '',
    };
  }

  editarPerfil(): void {
    this.perfilEditando = true;
    this.cargarPerfilForm();
  }

  cancelarEdicionPerfil(): void {
    this.perfilEditando = false;
    this.cargarPerfilForm();
  }

  async guardarPerfil(): Promise<void> {
    if (!this.programador) return;

    if (
      !this.perfilForm.nombre.trim() ||
      !this.perfilForm.especialidad.trim()
    ) {
      alert('Nombre y especialidad son obligatorios');
      return;
    }

    const actualizado: Programador = {
      ...this.programador,
      nombre: this.perfilForm.nombre.trim(),
      especialidad: this.perfilForm.especialidad.trim(),
      descripcion: this.perfilForm.descripcion.trim(),
      fotoUrl: this.perfilForm.fotoUrl || undefined,
      emailContacto: this.perfilForm.emailContacto || undefined,
      githubUrl: this.perfilForm.githubUrl || undefined,
      linkedinUrl: this.perfilForm.linkedinUrl || undefined,
      sitioWeb: this.perfilForm.sitioWeb || undefined,
    };

    await this.programadorService.actualizarProgramador(actualizado);
    this.programador = actualizado;
    this.perfilEditando = false;

    this.mensajeExito = 'Perfil actualizado correctamente.';
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  //  Horarios propios

  nombreDiaSemana(dia?: number): string {
    const mapa: { [k: number]: string } = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
    };
    return dia != null ? mapa[dia] ?? '' : '';
  }

  descripcionDia(d: Disponibilidad): string {
    if (d.tipo === 'recurrente' && d.diaSemana != null) {
      return this.nombreDiaSemana(d.diaSemana);
    }
    if (d.fecha) return d.fecha;
    return '—';
  }

  descripcionRango(d: Disponibilidad): string {
    if (d.horaInicio && d.horaFin) {
      return `${d.horaInicio} - ${d.horaFin}`;
    }
    if (d.hora) return d.hora;
    return '—';
  }

  descripcionModalidad(d: Disponibilidad): string {
    return d.modalidad ? d.modalidad : 'Sin dato';
  }

  private calcularResumenAsesorias(): void {
    const estados: EstadoAsesoria[] = ['pendiente', 'aprobada', 'rechazada'];
    const porEstado = estados.map((estado) => ({
      estado,
      cantidad: this.asesorias.filter((a) => a.estado === estado).length,
    }));
    const porMes = this.construirSerieMensual(this.asesorias);
    const maxEstado = Math.max(1, ...porEstado.map((e) => e.cantidad));
    const maxMes = Math.max(1, ...porMes.map((m) => m.cantidad));

    this.resumenAsesorias = {
      total: this.asesorias.length,
      porEstado,
      porMes,
      maxEstado,
      maxMes,
    };
  }

  private construirSerieMensual(lista: Asesoria[]) {
    const ahora = new Date();
    const meses: { clave: string; etiqueta: string; cantidad: number }[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const etiqueta = `${anio}-${mes}`;
      meses.push({ clave: etiqueta, etiqueta, cantidad: 0 });
    }

    for (const a of lista) {
      const fecha = new Date(`${a.fecha}T00:00:00`);
      if (isNaN(fecha.getTime())) continue;
      const clave = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, '0')}`;
      const item = meses.find((m) => m.clave === clave);
      if (item) item.cantidad += 1;
    }

    return meses.map(({ etiqueta, cantidad }) => ({ etiqueta, cantidad }));
  }

  getAnchoBarra(valor: number, maximo: number): string {
    if (maximo <= 0) return '0%';
    return `${Math.round((valor / maximo) * 100)}%`;
  }

  async crearHorarioRecurrenteProgramador() {
    if (!this.programador) return;

    const f = this.formHorarioRecurrente;

    if (!f.horaInicio || !f.horaFin || !f.diasSeleccionados.length) {
      alert('Selecciona días y rango de horas');
      return;
    }

    const inicioMin = this.minutosDesdeHora(f.horaInicio);
    const finMin = this.minutosDesdeHora(f.horaFin);
    if (finMin <= inicioMin) {
      alert('La hora de fin debe ser mayor que la hora de inicio.');
      return;
    }
    if (finMin - inicioMin < 60) {
      alert('El rango debe ser de al menos 1 hora.');
      return;
    }

    for (const dia of f.diasSeleccionados) {
      await this.disponibilidadesService.crearDisponibilidad({
        programadorId: this.programador.id,
        tipo: 'recurrente',
        diaSemana: dia,
        horaInicio: f.horaInicio,
        horaFin: f.horaFin,
        modalidad: f.modalidad,
      });
    }

    await this.cargarHorarios();

    this.formHorarioRecurrente = {
      diasSeleccionados: [],
      horaInicio: '',
      horaFin: '',
      modalidad: 'virtual',
    };

    this.mensajeExito = 'Horarios recurrentes guardados.';
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async crearBloqueoProgramador() {
    if (!this.programador) return;

    const f = this.formBloqueo;

    if (!f.fecha) {
      alert('Selecciona una fecha');
      return;
    }

    let horaInicio = f.horaInicio;
    let horaFin = f.horaFin;

    if (f.todoElDia) {
      horaInicio = '00:00';
      horaFin = '23:59';
    }

    if (!horaInicio || !horaFin) {
      alert('Indica el rango de horas o marca "Todo el día"');
      return;
    }

    const inicioMin = this.minutosDesdeHora(horaInicio);
    const finMin = this.minutosDesdeHora(horaFin);
    if (finMin <= inicioMin) {
      alert('La hora de fin debe ser mayor que la hora de inicio.');
      return;
    }

    await this.disponibilidadesService.crearDisponibilidad({
      programadorId: this.programador.id,
      tipo: 'bloqueo',
      fecha: f.fecha,
      horaInicio,
      horaFin,
      modalidad: f.modalidad,
    });

    await this.cargarHorarios();

    this.formBloqueo = {
      fecha: '',
      horaInicio: '',
      horaFin: '',
      todoElDia: false,
      modalidad: 'virtual',
    };

    this.mensajeExito = 'Bloqueo registrado.';
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async eliminarDisponibilidadProgramador(d: Disponibilidad) {
    const confirmar = confirm(
      '¿Seguro que deseas eliminar este registro de disponibilidad?'
    );
    if (!confirmar) return;

    if (d.id == null) return;
    await this.disponibilidadesService.eliminarPorId(d.id);
    await this.cargarHorarios();
  }

  //  Asesorías

  async actualizarEstado(a: Asesoria): Promise<void> {
    if (a.programadorId == null) {
      alert('No se puede actualizar la asesoria sin programador asignado.');
      return;
    }

    if (a.estado === 'aprobada') {
      const asesoriasDia =
        await this.asesoriasService.getAsesoriasPorProgramadorYFecha(
          a.programadorId,
          a.fecha
        );
      const existeConflicto = asesoriasDia.some(
        (otro) =>
          otro.id !== a.id &&
          otro.estado !== 'rechazada' &&
          otro.hora === a.hora
      );
      if (existeConflicto) {
        alert(
          'Ya existe una asesoria en ese horario. Rechaza la otra o elige otro horario.'
        );
        return;
      }
    }

    const confirmar = confirm(
      `Seguro que deseas actualizar el estado de la asesoria #${a.id} a "${a.estado}"?`
    );
    if (!confirmar) return;

    if (a.id == null) {
      alert('No se puede actualizar una asesoria sin ID.');
      return;
    }

    await this.asesoriasService.actualizarAsesoria(a.id, {
      estado: a.estado,
      mensajeRespuesta: a.mensajeRespuesta ?? '',
    });

    this.calcularResumenAsesorias();
    this.mensajeExito = `Asesoría #${a.id} actualizada correctamente`;

    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }

  //  Proyectos

  prepararNuevoProyecto(): void {
    this.editandoProyectoId = null;
    this.nuevoProyecto = {
      id: undefined,
      nombre: '',
      descripcion: '',
      seccion: 'academico',
      participacion: 'Frontend',
      tecnologias: [],
      repoUrl: '',
      demoUrl: '',
    };
    this.tecnologiasTexto = '';
  }

  editarProyecto(p: Proyecto): void {
    this.editandoProyectoId = p.id ?? null;
    this.nuevoProyecto = { ...p };
    this.tecnologiasTexto = p.tecnologias.join(', ');
  }

  cancelarEdicion(): void {
    this.prepararNuevoProyecto();
  }

  async guardarProyecto(): Promise<void> {
    if (!this.programador) return;

    if (!this.nuevoProyecto.nombre || !this.nuevoProyecto.descripcion) {
      alert('Nombre y descripción son obligatorios');
      return;
    }

    const tecnologiasLimpias = this.tecnologiasTexto
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    this.nuevoProyecto.tecnologias = tecnologiasLimpias;
    const proyectosActuales = [...(this.programador.proyectos || [])];

    if (this.editandoProyectoId == null) {
      const proyectoAGuardar: Proyecto = {
        ...this.nuevoProyecto,
        id: undefined,
      };

      proyectosActuales.push(proyectoAGuardar);
    } else {
      const idx = proyectosActuales.findIndex(
        (p) => p.id === this.editandoProyectoId
      );
      if (idx !== -1) {
        proyectosActuales[idx] = {
          ...this.nuevoProyecto,
          id: this.editandoProyectoId,
        };
      }
    }

    await this.programadorService.actualizarProyectosProgramador(
      this.programador.id,
      proyectosActuales
    );

    const recargado = await this.programadorService.getProgramadorById(
      this.programador.id
    );
    if (recargado) {
      this.programador = recargado;
    } else {
      this.programador.proyectos = proyectosActuales;
    }
    this.mensajeExito =
      this.editandoProyectoId == null
        ? 'Proyecto creado correctamente.'
        : 'Proyecto actualizado correctamente.';

    this.prepararNuevoProyecto();

    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async eliminarProyecto(p: Proyecto): Promise<void> {
    if (!this.programador) return;

    const confirmar = confirm(
      `¿Seguro que deseas eliminar el proyecto "${p.nombre}"?`
    );
    if (!confirmar) return;

    const proyectosActuales = (this.programador.proyectos || []).filter(
      (proj) => proj.id !== p.id
    );

    await this.programadorService.actualizarProyectosProgramador(
      this.programador.id,
      proyectosActuales
    );

    this.programador.proyectos = proyectosActuales;
  }

  toggleDiaRecurrenteProgramador(dia: number, seleccionado: boolean){
    const dias = this.formHorarioRecurrente.diasSeleccionados;
    if(seleccionado){
      if(!dias.includes(dia)){
        dias.push(dia);
      }
    } else {
      const index = dias.indexOf(dia);
      if(index > -1){
        dias.splice(index, 1);
      }
    }
  }
}
