import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Especialidad,
  EspecialidadPayload,
} from '../models/especialidad.model';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Especialidades {
  private readonly apiUrl =
    'https://daw-grupal.onrender.com/api/especialidades/';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Especialidad[]> {
    return this.http
      .get<Especialidad[] | PaginatedResponse<Especialidad>>(
        this.apiUrl,
      )
      .pipe(
        map((response) =>
          Array.isArray(response) ? response : response.results,
        ),
      );
  }

  obtener(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(
      `${this.apiUrl}${id}/`,
    );
  }

  crear(
    especialidad: EspecialidadPayload,
  ): Observable<Especialidad> {
    return this.http.post<Especialidad>(
      this.apiUrl,
      especialidad,
    );
  }

  actualizar(
    id: number,
    especialidad: EspecialidadPayload,
  ): Observable<Especialidad> {
    return this.http.put<Especialidad>(
      `${this.apiUrl}${id}/`,
      especialidad,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`,
    );
  }
}