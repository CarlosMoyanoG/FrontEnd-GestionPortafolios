import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class GestionUsuario {
  private http = inject(HttpClient);
  private urlApi = 'http://127.0.0.1:8080/GestorProyectos/api/usuario';

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlApi);
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlApi}/${id}`);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlApi, usuario);
  }

  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlApi}/${usuario.id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
