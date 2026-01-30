import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '../../modelos/proyecto';

@Injectable({
  providedIn: 'root',
})
export class GestionProyecto {
  private http = inject(HttpClient);
  private urlApi = 'http://127.0.0.1:8080/GestorProyectos/api/proyecto';

  listar(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.urlApi);
  }

  obtener(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.urlApi}/${id}`);
  }

  crear(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.urlApi, proyecto);
  }

  actualizar(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.urlApi}/${proyecto.id}`, proyecto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
