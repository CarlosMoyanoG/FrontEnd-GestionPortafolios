import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Asesorias } from '../../servicios/asesorias';
import { Autenticacion } from '../../servicios/autenticacion';
import { Programadores } from '../../servicios/programadores';
import { Asesoria } from '../../modelos/asesoria';

type AsesoriaConProgramador = Asesoria & { nombreProgramador: string };

@Component({
  selector: 'app-mis-asesorias-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-asesorias-cliente.html',
  styleUrl: './mis-asesorias-cliente.scss',
})
export class MisAsesoriasCliente implements OnInit {

  asesoriasCliente: AsesoriaConProgramador[] = [];
  notificacionesRecientes: AsesoriaConProgramador[] = [];

  cargando = true;
  emailClienteActual: string | undefined;

  constructor(
    private asesoriasService: Asesorias,
    private auth: Autenticacion,
    private programadoresService: Programadores,
  ) {}

  async ngOnInit(): Promise<void> {
    this.emailClienteActual = this.auth.usuarioActual.email;

    if (!this.emailClienteActual) {
      this.cargando = false;
      return;
    }

    const [asesorias, programadores] = await Promise.all([
      this.asesoriasService.getAsesoriasPorEmailCliente(this.emailClienteActual),
      this.programadoresService.getProgramadores()
    ]);

    const lista: AsesoriaConProgramador[] = asesorias.map(a => {
      const prog = programadores.find(p => p.id === a.programadorId);
      return {
        ...a,
        nombreProgramador: prog ? prog.nombre : `ID ${a.programadorId}`,
      };
    });

    lista.sort((a, b) => b.id - a.id);
    this.asesoriasCliente = lista;
    this.notificacionesRecientes = lista.filter(a => a.estado !== 'pendiente');
    this.cargando = false;
  }
}
