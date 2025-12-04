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

  private _uid: string | null = null;

  constructor(
    private authFirebase: Auth,
    private usuariosService: Usuarios,
    private programadoresService: Programadores
  ) {

    this.inicializarEscuchaAuth();
  }

  get usuarioActual(): Usuario {
    return this._usuarioActual;
  }

  get uid(): string | null {
    return this._uid;
  }

  esVisitante(): boolean {
    return this._usuarioActual.rol === 'visitante';
  }

  esAdmin(): boolean {
    return this._usuarioActual.rol === 'admin';
  }

  esProgramador(): boolean {
    return this._usuarioActual.rol === 'programador';
  }

  private inicializarEscuchaAuth(): void {
    onAuthStateChanged(this.authFirebase, async (user) => {
      try {
        if (user) {
          this._uid = user.uid;

          const usuarioDb = await this.usuariosService.obtenerOCrearUsuarioDesdeFirebase({
            uid: user.uid,
            nombre: user.displayName,
            email: user.email,
            fotoUrl: user.photoURL,
          });

          this._usuarioActual = usuarioDb;

          if (
            usuarioDb.rol === 'programador' &&
            usuarioDb.programadorId != null
          ) {
            await this.programadoresService.actualizarDuenioYContacto(
              usuarioDb.programadorId,
              user.uid,
              usuarioDb.email ?? user.email ?? null,
              usuarioDb.fotoUrl ?? user.photoURL ?? undefined
            );
          }

          console.log('Sesión restaurada desde Firebase:', this._usuarioActual);
        } else {
          this._uid = null;
          this._usuarioActual = {
            id: 0,
            nombre: 'Visitante',
            rol: 'visitante',
          };
          console.log('No hay sesión activa (usuario visitante).');
        }
      } catch (error) {
        console.error('Error al sincronizar la sesión:', error);
      }
    });
  }

  // LOGIN normal (visitante / programador)
  async loginConGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.authFirebase, provider);
    const user = cred.user;

    this._uid = user.uid;

    // Sincroniza usuario en colección usuarioss
    const usuarioDb = await this.usuariosService.obtenerOCrearUsuarioDesdeFirebase({
      uid: user.uid,
      nombre: user.displayName,
      email: user.email,
      fotoUrl: user.photoURL,
    });

    this._usuarioActual = usuarioDb;

    console.log('Login Google, datos app:', this._usuarioActual);

    if (
      usuarioDb.rol === 'programador' &&
      usuarioDb.programadorId != null
    ) {
      await this.programadoresService.actualizarDuenioYContacto(
        usuarioDb.programadorId,
        user.uid,                                     
        usuarioDb.email ?? user.email ?? null,
        usuarioDb.fotoUrl ?? user.photoURL ?? undefined 
      );
    }
  }

  async cerrarSesion(): Promise<void> {
    await signOut(this.authFirebase);

    this._uid = null;
    this._usuarioActual = {
      id: 0,
      nombre: 'Visitante',
      rol: 'visitante',
    };

    console.log('Sesión cerrada');
  }
}
