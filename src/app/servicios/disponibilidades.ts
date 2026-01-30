import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Disponibilidad } from '../modelos/disponibilidad';
import { GestionDisponibilidad } from './servicios-gestiones/gestion-disponibilidad';

@Injectable({
  providedIn: 'root',
})
export class Disponibilidades {
  constructor(private gestionDisponibilidad: GestionDisponibilidad) {}

  private normalizarDisponibilidad(
    data: Disponibilidad | Record<string, any>
  ): Disponibilidad {
    const d = data as Record<string, any>;
    const id = d['id'] ?? d['dis_id'] ?? d['disId'];
    const programadorId =
      d['programadorId'] ??
      d['dis_progId'] ??
      d['disProgId'] ??
      d['prog_id'];

    return {
      id: id != null ? Number(id) : undefined,
      programadorId:
        programadorId != null && programadorId !== ''
          ? Number(programadorId)
          : undefined,
      tipo: d['tipo'] ?? d['dis_tipo'] ?? d['disTipo'] ?? 'recurrente',
      modalidad: d['modalidad'] ?? d['dis_modalidad'] ?? d['disModalidad'],
      diaSemana:
        d['diaSemana'] ??
        d['dis_diaSemana'] ??
        d['disDiaSemana'] ??
        undefined,
      fecha: d['fecha'] ?? d['dis_fecha'] ?? d['disFecha'],
      horaInicio: d['horaInicio'] ?? d['dis_horaInicio'] ?? d['disHoraInicio'],
      horaFin: d['horaFin'] ?? d['dis_horaFin'] ?? d['disHoraFin'],
      hora: d['hora'] ?? d['dis_hora'] ?? d['disHora'],
    };
  }

  // CREAR DISPONIBILIDAD
  async crearDisponibilidad(
    data: Omit<Disponibilidad, 'id'>
  ): Promise<Disponibilidad> {
    const registro = await firstValueFrom(
      this.gestionDisponibilidad.crear(data as Disponibilidad)
    );
    return this.normalizarDisponibilidad(registro);
  }

  // OBTENER DISPONIBILIDADES
  async getTodas(): Promise<Disponibilidad[]> {
    const data = await firstValueFrom(this.gestionDisponibilidad.listar());
    return data.map((d) => this.normalizarDisponibilidad(d));
  }

  // OBTENER DISPONIBILIDADES POR CRITERIOS
  async getPorProgramador(programadorId: number): Promise<Disponibilidad[]> {
    const todas = await this.getTodas();
    return todas.filter((d) => d.programadorId === programadorId);
  }

  // ELIMINAR DISPONIBILIDAD POR ID
  async eliminarPorId(id: number): Promise<void> {
    await firstValueFrom(this.gestionDisponibilidad.eliminar(id));
  }
}
