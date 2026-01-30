import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelos/usuario';

@Injectable({
  providedIn: 'root',
})
export class GestionUsuario {
  private http = inject(HttpClient);
  private urlApi = 'http://localhost:8002/api/usuarios';

  private toApi(usuario: Usuario): Record<string, any> {
    return {
      ...usuario,
      mail: usuario.email,
      prog_id: usuario.programadorId,
      usu_mail: usuario.email,
      usu_progId: usuario.programadorId,
      foto_url: usuario.fotoUrl,
      usu_fotoUrl: usuario.fotoUrl,
    };
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlApi);
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlApi}/${id}`);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlApi, this.toApi(usuario) as Usuario);
  }

  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.urlApi}/${usuario.id}`,
      this.toApi(usuario) as Usuario
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
