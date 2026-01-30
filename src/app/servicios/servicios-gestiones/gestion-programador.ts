import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programador } from '../../modelos/programador';

@Injectable({
  providedIn: 'root',
})
export class GestionProgramador {
  private http = inject(HttpClient);
  private urlApi = 'http://127.0.0.1:8080/GestorProyectos/api/programador';

  listar(): Observable<Programador[]> {
    return this.http.get<Programador[]>(this.urlApi);
  }

  obtener(id: number): Observable<Programador> {
    return this.http.get<Programador>(`${this.urlApi}/${id}`);
  }

  crear(programador: Programador): Observable<Programador> {
    return this.http.post<Programador>(this.urlApi, programador);
  }

  actualizar(programador: Programador): Observable<Programador> {
    return this.http.put<Programador>(`${this.urlApi}/${programador.id}`, programador);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
