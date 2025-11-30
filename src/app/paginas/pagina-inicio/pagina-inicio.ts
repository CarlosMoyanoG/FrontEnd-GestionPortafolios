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

  constructor(private programService: Programadores) {}

  async ngOnInit(): Promise<void> {
    this.programadores = await this.programService.getProgramadores();
  }
}
