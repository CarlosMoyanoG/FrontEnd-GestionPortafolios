import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Usuarios } from './usuarios';
import { Programadores } from './programadores';

@Injectable({
  providedIn: 'root',
})
export class Autenticacion {
  private _usuarioActual: Usuario = {
    id: 0,
    nombre: 'Visitante',
    rol: 'visitante',
    email: 'prueba@gmail.com',
  };

  private loginEnCurso = false;
  private _uid: string | null = null;
  private ultimoUidSincronizado: string | null = null;
  private sincronizando: Promise<Usuario> | null = null;

  constructor(
    private authFirebase: Auth,
    private usuariosService: Usuarios,
    private programadoresService: Programadores
  ) {
    this.inicializarEscuchaAuth();
  }

  // GETTERS
  get usuarioActual(): Usuario {
    return this._usuarioActual;
  }

  get uid(): string | null {
    return this._uid;
  }

  // METODOS DE ROL
  esVisitante(): boolean {
    return this._usuarioActual.rol === 'visitante';
  }

  esAdmin(): boolean {
    return this._usuarioActual.rol === 'admin';
  }

  esProgramador(): boolean {
    return this._usuarioActual.rol === 'programador';
  }

  // INICIALIZAR ESCUCHA DE AUTENTICACION
  private inicializarEscuchaAuth(): void {
    onAuthStateChanged(this.authFirebase, async (user) => {
      try {
        if (user) {
          this._uid = user.uid;
          if (
            user.uid === this.ultimoUidSincronizado &&
            this._usuarioActual.id !== 0
          ) {
            return;
          }

          await this.sincronizarUsuario(user);
          console.log('Sesion restaurada desde Firebase:', this._usuarioActual);
        } else {
          this._uid = null;
          this.ultimoUidSincronizado = null;
          this._usuarioActual = {
            id: 0,
            nombre: 'Visitante',
            rol: 'visitante',
          };
          console.log('No hay sesion activa (usuario visitante).');
        }
      } catch (error) {
        console.error('Error al sincronizar la sesion:', error);
      }
    });
  }

  // LOGIN normal (visitante / programador)
  async loginConGoogle(): Promise<void> {
    if (this.loginEnCurso) return;
    this.loginEnCurso = true;
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(this.authFirebase, provider);
      const user = cred.user;
      this._uid = user.uid;
      await this.sincronizarUsuario(user);
    } finally {
      this.loginEnCurso = false;
    }
  }

  async cerrarSesion(): Promise<void> {
    await signOut(this.authFirebase);

    this._uid = null;
    this.ultimoUidSincronizado = null;
    this._usuarioActual = {
      id: 0,
      nombre: 'Visitante',
      rol: 'visitante',
    };

    console.log('Sesion cerrada');
  }

  private async sincronizarUsuario(user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null; }): Promise<Usuario> {
    if (this.sincronizando) {
      return this.sincronizando;
    }

    this.sincronizando = (async () => {
      const usuarioDb =
        await this.usuariosService.obtenerOCrearUsuarioDesdeFirebase({
          uid: user.uid,
          nombre: user.displayName,
          email: user.email,
          fotoUrl: user.photoURL,
        });

      this._usuarioActual = usuarioDb;
      this.ultimoUidSincronizado = user.uid;

      if (usuarioDb.rol === 'programador' && usuarioDb.programadorId != null) {
        await this.programadoresService.actualizarDuenioYContacto(
          usuarioDb.programadorId,
          user.uid,
          usuarioDb.email ?? user.email ?? null,
          usuarioDb.fotoUrl ?? user.photoURL ?? undefined
        );
      }

      return usuarioDb;
    })();

    try {
      return await this.sincronizando;
    } finally {
      this.sincronizando = null;
    }
  }
}
