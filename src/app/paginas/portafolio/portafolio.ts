import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Proyecto } from '../../modelos/proyecto';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.scss',
})
export class Portafolio {

  programador?: Programador;
  proyectosAcademicos: Proyecto[] = [];
  proyectosLaborales: Proyecto[] = [];

  constructor(
    private route: ActivatedRoute,
    private programadoresService: Programadores
  ) {}

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;

    this.programador = await this.programadoresService.getProgramadorById(id);
  }
}
