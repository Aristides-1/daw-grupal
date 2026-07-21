import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Atencion,
  AtencionPayload,
} from '../models/atencion.model';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Atenciones {
  private readonly apiUrl =
    'https://daw-grupal.onrender.com/api/atenciones/';

  constructor(
    private readonly http: HttpClient,
  ) {}

  listar(): Observable<Atencion[]> {
    return this.http
      .get<Atencion[] | PaginatedResponse<Atencion>>(
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

  obtener(id: number): Observable<Atencion> {
    return this.http.get<Atencion>(
      `${this.apiUrl}${id}/`,
    );
  }

  crear(
    atencion: AtencionPayload,
  ): Observable<Atencion> {
    return this.http.post<Atencion>(
      this.apiUrl,
      atencion,
    );
  }

  actualizar(
    id: number,
    atencion: AtencionPayload,
  ): Observable<Atencion> {
    return this.http.put<Atencion>(
      `${this.apiUrl}${id}/`,
      atencion,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`,
    );
  }
}