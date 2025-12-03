import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Autenticacion } from '../../servicios/autenticacion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    public auth: Autenticacion,
    private router: Router
  ) {}

  async loginGoogle() {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    try {
      await this.auth.loginConGoogle();

      const rol = this.auth.usuarioActual.rol;

      if (rol === 'admin') {
        this.mensaje = 'Sesión iniciada como Administrador.';
        this.router.navigate(['/admin']);
      } else if (rol === 'programador') {
        this.mensaje = 'Sesión iniciada como Programador.';
        this.router.navigate(['/programador']);
      } else {
        this.mensaje = 'Sesión iniciada como Visitante.';
        this.router.navigate(['/inicio']);
      }

    } catch (e) {
      console.error(e);
      this.error = 'Ocurrió un error al iniciar sesión con Google.';
    } finally {
      this.cargando = false;
    }
  }
}
