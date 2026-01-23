import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asesoria } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class GestionAsesoria {
  private http = inject(HttpClient);
  private urlApi = 'http://127.0.0.1:8080/GestorProyectos/api/asesoria';

  listar(): Observable<Asesoria[]> {
    return this.http.get<Asesoria[]>(this.urlApi);
  }

  obtener(id: number): Observable<Asesoria> {
    return this.http.get<Asesoria>(`${this.urlApi}/${id}`);
  }

  crear(asesoria: Asesoria): Observable<Asesoria> {
    return this.http.post<Asesoria>(this.urlApi, asesoria);
  }

  actualizar(asesoria: Asesoria): Observable<Asesoria> {
    return this.http.put<Asesoria>(`${this.urlApi}/${asesoria.id}`, asesoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
