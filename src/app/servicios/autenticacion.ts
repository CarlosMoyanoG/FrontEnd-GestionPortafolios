import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root',
})

export class Autenticacion {

  private _usuarioActual: Usuario = {
    id: 0,
    nombre: 'Visitante',
    rol: 'visitante'
  }

  get usuarioActual(): Usuario {
    return this._usuarioActual;
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

  loginComoAdmin(): void {
    this._usuarioActual = {
      id: 1,
      nombre: 'Admin Demo',
      rol: 'admin'
    };
    console.log('Login como ADMIN', this._usuarioActual);
  }

  loginComoProgramador(): void {
    this._usuarioActual = {
      id: 2,
      nombre: 'Paz Guerrero',
      rol: 'programador',
      programadorId: 1
    };
    console.log('Login como PROGRAMADOR', this._usuarioActual);
  }

  cerrarSesion(): void {
    this._usuarioActual = {
      id: 0,
      nombre: 'Visitante',
      rol: 'visitante'
    };
    console.log('Sesión cerrada', this._usuarioActual);
  }
}
