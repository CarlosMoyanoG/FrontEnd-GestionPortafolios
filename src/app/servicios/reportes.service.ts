import { Injectable } from '@angular/core';
import { Asesorias } from './asesorias';
import { Programadores } from './programadores';
import { Usuarios } from './usuarios';
import { FiltroReporte } from '../modelos/filtro-reporte';
import { ReporteAsesoria } from '../modelos/reporte-asesorias';
import { ReporteProyectosUsuario } from '../modelos/reporte-proyectos-usuario';
import { Proyecto } from '../modelos/proyecto';

export interface ReporteResumen {
  totalAsesorias: number;
  asesoriasPendientes: number;
  asesoriasAprobadas: number;
  asesoriasRechazadas: number;
  totalUsuarios: number;
  totalProgramadores: number;
  totalProyectos: number;
  proyectosActivos: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor(
    private asesoriasService: Asesorias,
    private programadoresService: Programadores,
    private usuariosService: Usuarios
  ) {}

  private estaEnRango(fecha: string, inicio?: string, fin?: string): boolean {
    if (inicio && fecha < inicio) return false;
    if (fin && fecha > fin) return false;
    return true;
  }

  private contarProyectosActivos(proyectos: Proyecto[]): number {
    return proyectos.filter(p => Boolean(p.demoUrl || p.repoUrl)).length;
  }

  async getReporteAsesorias(filtro: FiltroReporte = {}): Promise<ReporteAsesoria[]> {
    const [asesorias, programadores] = await Promise.all([
      this.asesoriasService.getAsesorias(),
      this.programadoresService.getProgramadores(),
    ]);

    const nombrePorId = new Map(programadores.map(p => [p.id, p.nombre]));
    const filtradas = asesorias.filter(a => {
      if (a.programadorId == null) {
        return false;
      }
      if (filtro.programadorId != null && a.programadorId !== filtro.programadorId) {
        return false;
      }
      if (filtro.estado && a.estado !== filtro.estado) {
        return false;
      }
      if (!this.estaEnRango(a.fecha, filtro.fechaInicio, filtro.fechaFin)) {
        return false;
      }
      return true;
    });

    const acumulado = new Map<string, ReporteAsesoria>();

    for (const asesoria of filtradas) {
      const programadorId = asesoria.programadorId;
      if (programadorId == null) {
        continue;
      }
      const key = `${programadorId}-${asesoria.fecha}-${asesoria.estado}`;
      const actual = acumulado.get(key);
      if (actual) {
        actual.total += 1;
        continue;
      }

      acumulado.set(key, {
        programadorId,
        nombreProgramador: nombrePorId.get(programadorId) ?? `ID ${programadorId}`,
        fecha: asesoria.fecha,
        estado: asesoria.estado,
        total: 1,
      });
    }

    return Array.from(acumulado.values()).sort((a, b) => {
      const fechaCmp = b.fecha.localeCompare(a.fecha);
      if (fechaCmp !== 0) return fechaCmp;
      const nombreCmp = a.nombreProgramador.localeCompare(b.nombreProgramador);
      if (nombreCmp !== 0) return nombreCmp;
      return a.estado.localeCompare(b.estado);
    });
  }

  async getReporteProyectosPorUsuario(): Promise<ReporteProyectosUsuario[]> {
    const [usuarios, programadores] = await Promise.all([
      this.usuariosService.getUsuarios(),
      this.programadoresService.getProgramadores(),
    ]);

    const programadoresPorId = new Map(programadores.map(p => [p.id, p]));

    return usuarios
      .filter(usuario => usuario.rol === 'programador')
      .map(usuario => {
        const programador = usuario.programadorId != null ? programadoresPorId.get(usuario.programadorId) : undefined;
        const proyectos = programador?.proyectos ?? [];
        return {
          usuarioUid: usuario.uid,
          nombreUsuario: usuario.nombre,
          email: usuario.email,
          programadorId: usuario.programadorId,
          totalProyectos: proyectos.length,
          proyectosActivos: this.contarProyectosActivos(proyectos),
        };
      })
      .sort((a, b) => b.totalProyectos - a.totalProyectos);
  }

  async getResumenReportes(): Promise<ReporteResumen> {
    const [asesorias, usuarios, programadores] = await Promise.all([
      this.asesoriasService.getAsesorias(),
      this.usuariosService.getUsuarios(),
      this.programadoresService.getProgramadores(),
    ]);

    const asesoriasPendientes = asesorias.filter(a => a.estado === 'pendiente').length;
    const asesoriasAprobadas = asesorias.filter(a => a.estado === 'aprobada').length;
    const asesoriasRechazadas = asesorias.filter(a => a.estado === 'rechazada').length;

    const totalProyectos = programadores.reduce((acc, p) => acc + (p.proyectos?.length ?? 0), 0);
    const proyectosActivos = programadores.reduce(
      (acc, p) => acc + this.contarProyectosActivos(p.proyectos ?? []),
      0
    );

    return {
      totalAsesorias: asesorias.length,
      asesoriasPendientes,
      asesoriasAprobadas,
      asesoriasRechazadas,
      totalUsuarios: usuarios.length,
      totalProgramadores: programadores.length,
      totalProyectos,
      proyectosActivos,
    };
  }
}
