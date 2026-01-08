import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service';
import { ReporteProyectosUsuario as ReporteProyectosUsuarioModelo } from '../../modelos/reporte-proyectos-usuario';

@Component({
  selector: 'app-reporte-proyectos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reporte-proyectos-usuario.html',
  styleUrl: './reporte-proyectos-usuario.scss',
})
export class ReporteProyectosUsuario implements OnInit {
  reporte: ReporteProyectosUsuarioModelo[] = [];
  cargando = true;
  filtroTexto = '';

  constructor(private reportesService: ReportesService) {}

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.reporte = await this.reportesService.getReporteProyectosPorUsuario();
    } finally {
      this.cargando = false;
    }
  }

  get reporteFiltrado(): ReporteProyectosUsuarioModelo[] {
    const texto = this.filtroTexto.trim().toLowerCase();
    if (!texto) return this.reporte;

    return this.reporte.filter(item => {
      return (
        item.nombreUsuario.toLowerCase().includes(texto) ||
        (item.email ?? '').toLowerCase().includes(texto)
      );
    });
  }

  exportarCsv(): void {
    const encabezados = [
      'Usuario',
      'Email',
      'ID Programador',
      'Proyectos creados',
      'Proyectos activos',
    ];
    const filas = this.reporteFiltrado.map(item => [
      item.nombreUsuario,
      item.email ?? '',
      item.programadorId != null ? String(item.programadorId) : '',
      String(item.totalProyectos),
      String(item.proyectosActivos),
    ]);
    const csv = this.construirCsv([encabezados, ...filas]);
    this.descargarArchivo(`reporte-proyectos-${this.fechaActual()}.csv`, csv);
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
