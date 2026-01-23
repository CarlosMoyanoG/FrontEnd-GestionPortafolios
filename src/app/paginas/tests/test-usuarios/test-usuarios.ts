import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, RolUsuario } from '../../../domain/models';
import { GestionUsuario } from '../../../servicios/servicios-gestiones/gestion-usuario';

@Component({
  selector: 'app-test-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-usuarios.html',
  styleUrl: './test-usuarios.scss',
})
export class TestUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  roles: RolUsuario[] = ['visitante', 'admin', 'programador'];
  cargando = false;
  mensaje = '';
  error = '';
  enEdicion = false;

  usuario: Usuario = {
    id: 0,
    nombre: '',
    email: '',
    fotoUrl: '',
    rol: 'visitante',
    programadorId: null,
  };

  constructor(private usuarioService: GestionUsuario) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.usuarioService.listar().subscribe({
      next: (data) => (this.usuarios = data),
      error: () => (this.error = 'No se pudo cargar usuarios.'),
      complete: () => (this.cargando = false),
    });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';
    const payload: Usuario = {
      ...this.usuario,
      id: Number(this.usuario.id),
      programadorId:
        this.usuario.programadorId != null && this.usuario.programadorId !== ('' as any)
          ? Number(this.usuario.programadorId)
          : null,
    };

    if (!this.enEdicion) {
      delete (payload as Partial<Usuario>).id;
    }

    const accion = this.enEdicion
      ? this.usuarioService.actualizar(payload)
      : this.usuarioService.crear(payload);

    accion.subscribe({
      next: () => {
        this.mensaje = this.enEdicion ? 'Usuario actualizado.' : 'Usuario creado.';
        this.limpiar();
        this.cargar();
      },
      error: () => (this.error = 'Error al guardar usuario.'),
    });
  }

  editar(usuario: Usuario): void {
    this.usuario = { ...usuario };
    this.enEdicion = true;
  }

  eliminar(id: number): void {
    this.mensaje = '';
    this.error = '';
    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado.';
        this.cargar();
      },
      error: () => (this.error = 'Error al eliminar usuario.'),
    });
  }

  limpiar(): void {
    this.usuario = {
      id: 0,
      nombre: '',
      email: '',
      fotoUrl: '',
      rol: 'visitante',
      programadorId: null,
    };
    this.enEdicion = false;
  }
}
