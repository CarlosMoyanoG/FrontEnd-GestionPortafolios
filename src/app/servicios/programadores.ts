import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Programador } from '../modelos/programador';
import { Proyecto } from '../modelos/proyecto';
import { GestionProgramador } from './servicios-gestiones/gestion-programador';

@Injectable({
  providedIn: 'root',
})
export class Programadores {
  constructor(private gestionProgramador: GestionProgramador) {}

  private normalizarProyecto(data: Proyecto | Record<string, any>): Proyecto {
    const p = data as Record<string, any>;
    const id = p['id'] ?? p['proy_id'] ?? p['proyId'];
    const tecnologias =
      p['tecnologias'] ??
      p['proy_tecnologias'] ??
      p['proyTecnologias'] ??
      p['proy_tecnologia'];

    return {
      id: id != null ? Number(id) : 0,
      nombre: p['nombre'] ?? p['proy_nombre'] ?? p['proyNombre'] ?? '',
      descripcion:
        p['descripcion'] ?? p['proy_descripcion'] ?? p['proyDescripcion'] ?? '',
      seccion:
        p['seccion'] ?? p['proy_seccion'] ?? p['proySeccion'] ?? 'academico',
      participacion:
        p['participacion'] ??
        p['proy_participacion'] ??
        p['proyParticipacion'] ??
        'Frontend',
      tecnologias: Array.isArray(tecnologias)
        ? tecnologias
        : tecnologias
        ? [String(tecnologias)]
        : [],
      repoUrl: p['repoUrl'] ?? p['proy_repoUrl'] ?? p['proyRepoUrl'],
      demoUrl: p['demoUrl'] ?? p['proy_demoUrl'] ?? p['proyDemoUrl'],
    };
  }

  private normalizarProgramador(
    data: Programador | Record<string, any>
  ): Programador {
    const p = data as Record<string, any>;
    const id = p['id'] ?? p['prog_id'] ?? p['progId'];
    const proyectos = p['proyectos'] ?? [];

    return {
      id: id != null ? Number(id) : 0,
      nombre: p['nombre'] ?? p['pro_nombre'] ?? p['proNombre'] ?? '',
      especialidad:
        p['especialidad'] ?? p['pro_especialidad'] ?? p['proEspecialidad'] ?? '',
      descripcion:
        p['descripcion'] ?? p['pro_descripcion'] ?? p['proDescripcion'] ?? '',
      fotoUrl: p['fotoUrl'] ?? p['pro_fotoUrl'] ?? p['proFotoUrl'],
      emailContacto:
        p['emailContacto'] ??
        p['pro_emailContacto'] ??
        p['proEmailContacto'],
      githubUrl: p['githubUrl'] ?? p['pro_githubUrl'] ?? p['proGithubUrl'],
      linkedinUrl:
        p['linkedinUrl'] ?? p['pro_linkedinUrl'] ?? p['proLinkedinUrl'],
      sitioWeb: p['sitioWeb'] ?? p['pro_sitioWeb'] ?? p['proSitioWeb'],
      duenioUid: p['duenioUid'] ?? p['pro_duenioUid'] ?? p['proDuenioUid'],
      proyectos: Array.isArray(proyectos)
        ? proyectos.map((proj: Proyecto | Record<string, any>) =>
            this.normalizarProyecto(proj)
          )
        : [],
    };
  }

  async getProgramadores(): Promise<Programador[]> {
    const data = await firstValueFrom(this.gestionProgramador.listar());
    return data.map((p) => this.normalizarProgramador(p));
  }

  async getProgramadorById(id: number): Promise<Programador | undefined> {
    try {
      const data = await firstValueFrom(this.gestionProgramador.obtener(id));
      return this.normalizarProgramador(data);
    } catch {
      return undefined;
    }
  }

  async crearProgramador(
    data: Omit<Programador, 'id' | 'duenioUid'>
  ): Promise<Programador> {
    const programador: Programador = {
      ...data,
    } as Programador;
    const creado = await firstValueFrom(this.gestionProgramador.crear(programador));
    return this.normalizarProgramador(creado);
  }

  private async getPorId(idProgramador: number): Promise<Programador | null> {
    try {
      const data = await firstValueFrom(this.gestionProgramador.obtener(idProgramador));
      return this.normalizarProgramador(data);
    } catch {
      console.warn('No se encontrÃ³ programador con id', idProgramador);
      return null;
    }
  }

  async actualizarDuenioUid(
    idProgramador: number,
    duenioUid?: string | null
  ): Promise<void> {
    const programador = await this.getPorId(idProgramador);
    if (!programador) return;

    programador.duenioUid = duenioUid ?? undefined;
    await firstValueFrom(this.gestionProgramador.actualizar(programador));
  }

  async actualizarProyectosProgramador(
    idProgramador: number,
    proyectos: Proyecto[]
  ): Promise<void> {
    const programador = await this.getPorId(idProgramador);
    if (!programador) return;

    const proyectosPayload = proyectos.map((p) => {
      const copy: any = { ...p };
      if (
        copy.id == null ||
        Number.isNaN(Number(copy.id)) ||
        Number(copy.id) <= 0 ||
        Number(copy.id) >= 1000000000000
      ) {
        delete copy.id;
      }
      return copy as Proyecto;
    });

    programador.proyectos = proyectosPayload;
    await firstValueFrom(this.gestionProgramador.actualizar(programador));
  }

  async actualizarProgramador(programador: Programador): Promise<void> {
    await firstValueFrom(this.gestionProgramador.actualizar(programador));
  }

  async eliminarProgramador(idProgramador: number): Promise<void> {
    await firstValueFrom(this.gestionProgramador.eliminar(idProgramador));
  }

  async actualizarDuenioYContacto(
    programadorId: number,
    duenioUid: string | null,
    email?: string | null,
    fotoUrl?: string
  ): Promise<void> {
    const programador = await this.getPorId(programadorId);
    if (!programador) return;

    programador.duenioUid = duenioUid ?? undefined;
    if (email !== undefined) {
      programador.emailContacto = email ?? undefined;
    }
    if (fotoUrl !== undefined) {
      programador.fotoUrl = fotoUrl;
    }

    await firstValueFrom(this.gestionProgramador.actualizar(programador));
  }
}
