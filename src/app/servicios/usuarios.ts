import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Usuario, RolUsuario } from '../modelos/usuario';
import { GestionUsuario } from './servicios-gestiones/gestion-usuario';

interface DatosFirebaseUsuario {
  uid: string;
  nombre: string | null;
  email: string | null;
  fotoUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Usuarios {
  constructor(private gestionUsuario: GestionUsuario) {}

  private creacionPorEmail = new Map<string, Promise<Usuario>>();

  private normalizarEmail(email?: string | null): string | undefined {
    if (!email) return undefined;
    const limpio = email.trim().toLowerCase();
    return limpio.length ? limpio : undefined;
  }

  private extraerEmail(usuario: Usuario | Record<string, any>): string | undefined {
    const u = usuario as Record<string, any>;
    return this.normalizarEmail(
      u['email'] ??
        u['mail'] ??
        u['usu_mail'] ??
        u['usuMail'] ??
        u['usu_email']
    );
  }

  private normalizarUsuario(usuario: Usuario | Record<string, any>): Usuario {
    const u = usuario as Record<string, any>;
    const id = Number(u['id'] ?? u['usu_id'] ?? u['usuId']);
    const programadorId = u['programadorId'] ?? u['prog_id'] ?? u['usu_progId'];

    return {
      id: Number.isFinite(id) ? id : 0,
      nombre: u['nombre'] ?? u['usu_nombre'] ?? u['usuNombre'] ?? 'Usuario',
      email: this.extraerEmail(u),
      rol: (u['rol'] ?? u['usu_rol'] ?? 'visitante') as RolUsuario,
      programadorId:
        programadorId != null && programadorId !== ''
          ? Number(programadorId)
          : undefined,
      fotoUrl: u['fotoUrl'] ?? u['usu_fotoUrl'] ?? u['usuFotoUrl'],
    };
  }

  private async listarUsuarios(): Promise<Usuario[]> {
    const data = await firstValueFrom(this.gestionUsuario.listar());
    return data.map((u) => this.normalizarUsuario(u));
  }

  async obtenerOCrearUsuarioDesdeFirebase(
    datos: DatosFirebaseUsuario
  ): Promise<Usuario> {
    const emailNormalizado = this.normalizarEmail(datos.email);
    const usuarios = await this.listarUsuarios();
    const existente = emailNormalizado
      ? usuarios.find((u) => this.extraerEmail(u) === emailNormalizado)
      : undefined;

    if (!existente) {
      if (emailNormalizado && this.creacionPorEmail.has(emailNormalizado)) {
        return await this.creacionPorEmail.get(emailNormalizado)!;
      }

      const nuevo: Usuario = {
        nombre: datos.nombre || 'Usuario',
        rol: 'visitante',
        email: emailNormalizado,
        fotoUrl: datos.fotoUrl || undefined,
      } as Usuario;

      const promesa = (async () => {
        const creado = await firstValueFrom(this.gestionUsuario.crear(nuevo));
        const creadoNormalizado = this.normalizarUsuario(creado);

        // Revalida por email para evitar duplicados si hubo carreras.
        if (emailNormalizado) {
          const lista = await this.listarUsuarios();
          const porEmail = lista.find((u) => this.extraerEmail(u) === emailNormalizado);
          return porEmail ?? creadoNormalizado;
        }

        return creadoNormalizado;
      })();

      if (emailNormalizado) {
        this.creacionPorEmail.set(emailNormalizado, promesa);
      }

      try {
        return await promesa;
      } finally {
        if (emailNormalizado) {
          this.creacionPorEmail.delete(emailNormalizado);
        }
      }
    }

    const existenteNormalizado = this.normalizarUsuario(existente);
    const cambios: Partial<Usuario> = {};

    if (datos.email && datos.email !== existenteNormalizado.email) {
      cambios.email = datos.email;
    }

    if (datos.fotoUrl && datos.fotoUrl !== existenteNormalizado.fotoUrl) {
      cambios.fotoUrl = datos.fotoUrl;
    }

    if (Object.keys(cambios).length > 0) {
      const actualizado: Usuario = { ...existenteNormalizado, ...cambios };
      await firstValueFrom(this.gestionUsuario.actualizar(actualizado));
      return actualizado;
    }

    return existenteNormalizado;
  }

  async obtenerUsuario(uid: string): Promise<Usuario | null> {
    const id = Number(uid);
    if (Number.isNaN(id)) return null;
    try {
      const usuario = await firstValueFrom(this.gestionUsuario.obtener(id));
      return this.normalizarUsuario(usuario);
    } catch {
      return null;
    }
  }

  async getUsuarios(): Promise<(Usuario & { uid: string })[]> {
    const usuarios = await this.listarUsuarios();
    return usuarios.map((u) => ({ ...u, uid: String(u.id) }));
  }

  async actualizarUsuarioRolYProgramador(
    uid: string,
    rol: RolUsuario,
    programadorId?: number | null
  ): Promise<void> {
    const id = Number(uid);
    if (Number.isNaN(id)) return;

    const usuario = await this.obtenerUsuario(uid);

    if (!usuario) return;

    const cambios: Usuario = {
      ...usuario,
      rol,
      programadorId:
        rol === 'programador' && programadorId != null ? programadorId : undefined,
    };

    await firstValueFrom(this.gestionUsuario.actualizar(cambios));
  }
}
