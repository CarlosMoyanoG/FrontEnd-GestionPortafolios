import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';

@Component({
  selector: 'app-pagina-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './pagina-inicio.html',
  styleUrl: './pagina-inicio.scss',
})
export class PaginaInicio{

  programadores: Programador[] = [];

  constructor(private programService: Programadores) {
    this.programadores = this.programService.getProgramadores();
  }
}
