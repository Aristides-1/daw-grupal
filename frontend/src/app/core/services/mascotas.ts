import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Mascota,
  MascotaPayload,
} from '../models/mascota.model';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Mascotas {
  private readonly apiUrl =
    'https://daw-grupal.onrender.com/api/mascotas/';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Mascota[]> {
    return this.http
      .get<Mascota[] | PaginatedResponse<Mascota>>(
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

  obtener(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(
      `${this.apiUrl}${id}/`,
    );
  }

  crear(mascota: MascotaPayload): Observable<Mascota> {
    return this.http.post<Mascota>(
      this.apiUrl,
      mascota,
    );
  }

  actualizar(
    id: number,
    mascota: MascotaPayload,
  ): Observable<Mascota> {
    return this.http.put<Mascota>(
      `${this.apiUrl}${id}/`,
      mascota,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`,
    );
  }
}