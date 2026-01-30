import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Asesoria } from '../modelos/asesoria';
import { GestionAsesoria } from './servicios-gestiones/gestion-asesoria';

@Injectable({
  providedIn: 'root',
})
export class Asesorias {
  constructor(private gestionAsesoria: GestionAsesoria) {}

  private normalizarAsesoria(data: Asesoria | Record<string, any>): Asesoria {
    const a = data as Record<string, any>;
    const id = a['id'] ?? a['ase_id'] ?? a['aseId'];
    const programadorId =
      a['programadorId'] ??
      a['ase_progId'] ??
      a['aseProgId'] ??
      a['prog_id'];

    return {
      id: id != null ? Number(id) : undefined,
      programadorId:
        programadorId != null && programadorId !== ''
          ? Number(programadorId)
          : undefined,
      nombreCliente:
        a['nombreCliente'] ??
        a['ase_nombreCliente'] ??
        a['aseNombreCliente'] ??
        '',
      emailCliente:
        a['emailCliente'] ??
        a['ase_emailCliente'] ??
        a['aseEmailCliente'] ??
        '',
      fecha: a['fecha'] ?? a['ase_fecha'] ?? a['aseFecha'] ?? '',
      hora: a['hora'] ?? a['ase_hora'] ?? a['aseHora'] ?? '',
      descripcionProyecto:
        a['descripcionProyecto'] ??
        a['ase_descripcionProyecto'] ??
        a['aseDescripcionProyecto'] ??
        '',
      estado:
        a['estado'] ??
        a['ase_estado'] ??
        a['aseEstado'] ??
        'pendiente',
      mensajeRespuesta:
        a['mensajeRespuesta'] ??
        a['ase_mensajeRespuesta'] ??
        a['aseMensajeRespuesta'],
    };
  }

  // CREAR ASESORIA
  async crearAsesoria(
    nueva: Omit<Asesoria, 'id' | 'estado' | 'programadorId'> & {
      programadorId: number;
    }
  ): Promise<Asesoria> {
    if (nueva.programadorId == null) {
      throw new Error('Se requiere programadorId para crear la asesoría.');
    }

    // ValidaciÃ³n preventiva: evitar doble reserva en misma fecha/hora para el mismo programador
    const asesorias = await this.getAsesoriasPorProgramadorYFecha(
      nueva.programadorId,
      nueva.fecha
    );
    const existeConflicto = asesorias.some(
      (a) => a.hora === nueva.hora && a.estado !== 'rechazada'
    );

    if (existeConflicto) {
      throw new Error(
        'La hora seleccionada ya estÃ¡ ocupada para este programador.'
      );
    }

    const asesoria: Asesoria = {
      estado: 'pendiente',
      ...nueva,
    };

    const creada = await firstValueFrom(this.gestionAsesoria.crear(asesoria));
    console.log('AsesorÃ­a creada:', creada);
    return this.normalizarAsesoria(creada);
  }

  // OBTENER ASESORIAS
  async getAsesorias(): Promise<Asesoria[]> {
    const data = await firstValueFrom(this.gestionAsesoria.listar());
    return data.map((a) => this.normalizarAsesoria(a));
  }

  // OBTENER ASESORIAS POR CRITERIOS
  async getAsesoriasPorEmailCliente(email: string): Promise<Asesoria[]> {
    const asesorias = await this.getAsesorias();
    return asesorias.filter((a) => a.emailCliente === email);
  }

  async getAsesoriasPorProgramadorYFecha(
    programadorId: number,
    fecha: string
  ): Promise<Asesoria[]> {
    const asesorias = await this.getAsesorias();
    return asesorias.filter(
      (a) => a.programadorId === programadorId && a.fecha === fecha
    );
  }

  // ACTUALIZAR ASESORIA
  async actualizarAsesoria(
    id: number,
    cambios: Partial<Asesoria>
  ): Promise<void> {
    const asesorias = await this.getAsesorias();
    const existente = asesorias.find((a) => a.id === id);
    if (!existente) {
      console.warn('No se encontrÃ³ asesoria con id', id);
      return;
    }

    const actualizada: Asesoria = { ...existente, ...cambios };
    await firstValueFrom(this.gestionAsesoria.actualizar(actualizada));
    console.log('AsesorÃ­a actualizada:', id, cambios);
  }
}
