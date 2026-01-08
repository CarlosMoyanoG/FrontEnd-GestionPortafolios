import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service';
import { Programadores } from '../../servicios/programadores';
import { Programador } from '../../modelos/programador';
import { ReporteAsesoria } from '../../modelos/reporte-asesorias';
import { FiltroReporte } from '../../modelos/filtro-reporte';
import { EstadoAsesoria } from '../../modelos/asesoria';

@Component({
  selector: 'app-reporte-asesorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reporte-asesorias.html',
  styleUrl: './reporte-asesorias.scss',
})
export class ReporteAsesorias implements OnInit {
  filtros: FiltroReporte = {};
  estados: EstadoAsesoria[] = ['pendiente', 'aprobada', 'rechazada'];
  programadores: Programador[] = [];
  reporte: ReporteAsesoria[] = [];
  cargando = true;

  constructor(
    private reportesService: ReportesService,
    private programadoresService: Programadores
  ) {}

  async ngOnInit(): Promise<void> {
    this.programadores = await this.programadoresService.getProgramadores();
    await this.aplicarFiltros();
  }

  async aplicarFiltros(): Promise<void> {
    this.cargando = true;
    try {
      const filtros: FiltroReporte = {
        ...this.filtros,
        fechaInicio: this.filtros.fechaInicio || undefined,
        fechaFin: this.filtros.fechaFin || undefined,
        programadorId: this.filtros.programadorId ?? undefined,
        estado: this.filtros.estado || undefined,
      };
      this.reporte = await this.reportesService.getReporteAsesorias(filtros);
    } finally {
      this.cargando = false;
    }
  }

  limpiarFiltros(): void {
    this.filtros = {};
    void this.aplicarFiltros();
  }

  exportarCsv(): void {
    const encabezados = ['Programador', 'Fecha', 'Estado', 'Total'];
    const filas = this.reporte.map(item => [
      item.nombreProgramador,
      item.fecha,
      item.estado,
      String(item.total),
    ]);
    const csv = this.construirCsv([encabezados, ...filas]);
    this.descargarArchivo(`reporte-asesorias-${this.fechaActual()}.csv`, csv);
  }

  private construirCsv(filas: string[][]): string {
    const separador = ';';
    const cuerpo = filas
      .map(fila => fila.map(celda => this.escapeCsv(celda, separador)).join(separador))
      .join('\r\n');
    return `\ufeff${cuerpo}`;
  }

  private escapeCsv(valor: string, separador: string): string {
    const patron = new RegExp(`[\"\\n\\r${separador}]`);
    if (patron.test(valor)) {
      return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
  }

  private descargarArchivo(nombre: string, contenido: string): void {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  private fechaActual(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
