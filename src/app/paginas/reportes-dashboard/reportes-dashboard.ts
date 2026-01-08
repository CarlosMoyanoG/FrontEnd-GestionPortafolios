import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportesService, ReporteResumen } from '../../servicios/reportes.service';

@Component({
  selector: 'app-reportes-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes-dashboard.html',
  styleUrl: './reportes-dashboard.scss',
})
export class ReportesDashboard implements OnInit {
  resumen: ReporteResumen | null = null;
  cargando = true;

  constructor(private reportesService: ReportesService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.resumen = await this.reportesService.getResumenReportes();
    } finally {
      this.cargando = false;
    }
  }
}
