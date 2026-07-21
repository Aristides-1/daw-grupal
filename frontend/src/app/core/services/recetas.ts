import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Receta,
  RecetaPayload,
} from '../models/receta.model';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Recetas {
  private readonly apiUrl =
    'https://daw-grupal.onrender.com/api/recetas/';

  constructor(
    private readonly http: HttpClient,
  ) {}

  listar(): Observable<Receta[]> {
    return this.http
      .get<Receta[] | PaginatedResponse<Receta>>(
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

  obtener(id: number): Observable<Receta> {
    return this.http.get<Receta>(
      `${this.apiUrl}${id}/`,
    );
  }

  crear(
    receta: RecetaPayload,
  ): Observable<Receta> {
    return this.http.post<Receta>(
      this.apiUrl,
      receta,
    );
  }

  actualizar(
    id: number,
    receta: RecetaPayload,
  ): Observable<Receta> {
    return this.http.put<Receta>(
      `${this.apiUrl}${id}/`,
      receta,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`,
    );
  }

  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}${id}/pdf/`,
      {
        responseType: 'blob',
      },
    );
  }
}