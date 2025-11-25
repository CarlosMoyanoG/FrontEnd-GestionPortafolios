import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from '@angular/fire/auth';
import { Usuarios} from './usuarios';

@Injectable({
  providedIn: 'root',
})

export class Autenticacion {

  private _usuarioActual: Usuario = {
    id: 0,
    nombre: 'Visitante',
    rol: 'visitante',
    email: 'prueba@gmail.com'
  }

  private _uid: string | null = null;

  constructor(private authFirebase: Auth, private usuariosService: Usuarios) {}

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

  // LOGIN REAL

  async loginConGoogleComoAdmin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.authFirebase, provider);

    this._usuarioActual = {
      id: 1,
      nombre: cred.user.displayName || 'Administrador',
      rol: 'admin',
      email: cred.user.email || undefined,
      fotoUrl: cred.user.photoURL || undefined,
    };

    console.log('Login Google como ADMIN', this._usuarioActual);
  }

  async loginConGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.authFirebase, provider);
    const user = cred.user;

    this._uid = user.uid;

    const usuarioDb = await this.usuariosService.obtenerOCrearUsuarioDesdeFirebase({
      uid: user.uid,
      nombre: user.displayName,
      email: user.email,
      fotoUrl: user.photoURL,
    });

    this._usuarioActual = usuarioDb;

    console.log('Login Google, datos app:', this._usuarioActual);
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
