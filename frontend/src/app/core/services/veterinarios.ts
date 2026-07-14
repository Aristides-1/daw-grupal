import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Veterinario,
  VeterinarioPayload,
} from '../models/veterinario.model';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Veterinarios {
  private readonly apiUrl =
    'http://localhost:8000/api/veterinarios/';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Veterinario[]> {
    return this.http
      .get<Veterinario[] | PaginatedResponse<Veterinario>>(
        this.apiUrl,
      )
      .pipe(
        map((response) =>
          Array.isArray(response) ? response : response.results,
        ),
      );
  }

  obtener(id: number): Observable<Veterinario> {
    return this.http.get<Veterinario>(
      `${this.apiUrl}${id}/`,
    );
  }

  crear(
    veterinario: VeterinarioPayload,
  ): Observable<Veterinario> {
    return this.http.post<Veterinario>(
      this.apiUrl,
      veterinario,
    );
  }

  actualizar(
    id: number,
    veterinario: VeterinarioPayload,
  ): Observable<Veterinario> {
    return this.http.put<Veterinario>(
      `${this.apiUrl}${id}/`,
      veterinario,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`,
    );
  }
}