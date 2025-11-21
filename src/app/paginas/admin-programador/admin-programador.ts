import { Component } from '@angular/core';
import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Asesoria } from '../../modelos/asesoria';
import { CommonModule } from '@angular/common';

const ID_PROGRAMADOR_ACTUAL = 1;

@Component({
  selector: 'app-admin-programador',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './admin-programador.html',
  styleUrl: './admin-programador.scss',
})

export class AdminProgramador {

  asesorias: Asesoria[] = [];
  programador: Programador | undefined;

  constructor(private programadorService: Programadores, private asesoriasService: Asesorias){
    this.programador = this.programadorService.getProgramadorById(ID_PROGRAMADOR_ACTUAL);
    const todas_asesorias = this.asesoriasService.getAsesorias();

    if(this.programador){
      const listaFiltrada: Asesoria[] = [];

      for (let i=0; i < todas_asesorias.length; i++){
        const asesoria = todas_asesorias[i];

        if (asesoria.programadorId === this.programador!.id){
          listaFiltrada.push(asesoria);
        }
      }

      this.asesorias = listaFiltrada;
    }
  }
}
