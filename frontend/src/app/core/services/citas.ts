import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Cita,
  CitaPayload,
} from '../models/cita.model';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Citas {
  private readonly apiUrl =
    'https://daw-grupal.onrender.com/api/citas/';

  constructor(
    private readonly http: HttpClient,
  ) {}

  listar(): Observable<Cita[]> {
    return this.http
      .get<Cita[] | PaginatedResponse<Cita>>(
        this.apiUrl,
      )
      .pipe(
        map((response) =>
          Array.isArray(response)
            ? response
            : response.results,
        ),
      );
  }

  obtener(id: number): Observable<Cita> {
    return this.http.get<Cita>(
      `${this.apiUrl}${id}/`,
    );
  }

  crear(cita: CitaPayload): Observable<Cita> {
    return this.http.post<Cita>(
      this.apiUrl,
      cita,
    );
  }

  actualizar(
    id: number,
    cita: CitaPayload,
  ): Observable<Cita> {
    return this.http.put<Cita>(
      `${this.apiUrl}${id}/`,
      cita,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`,
    );
  }
}