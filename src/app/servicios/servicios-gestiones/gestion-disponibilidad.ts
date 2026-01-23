import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidad } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class GestionDisponibilidad {
  private http = inject(HttpClient);
  private urlApi = 'http://127.0.0.1:8080/GestorProyectos/api/disponibilidad';

  listar(): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(this.urlApi);
  }

  obtener(id: number): Observable<Disponibilidad> {
    return this.http.get<Disponibilidad>(`${this.urlApi}/${id}`);
  }

  crear(disponibilidad: Disponibilidad): Observable<Disponibilidad> {
    return this.http.post<Disponibilidad>(this.urlApi, disponibilidad);
  }

  actualizar(disponibilidad: Disponibilidad): Observable<Disponibilidad> {
    return this.http.put<Disponibilidad>(`${this.urlApi}/${disponibilidad.id}`, disponibilidad);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
