import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  Cliente,
  ClientePayload,
  PaginatedResponse,
} from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class Clientes {
  private readonly apiUrl = 'http://localhost:8000/api/clientes/';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http
      .get<Cliente[] | PaginatedResponse<Cliente>>(this.apiUrl)
      .pipe(
        map((response) =>
          Array.isArray(response) ? response : response.results,
        ),
      );
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}${id}/`);
  }

  crear(cliente: ClientePayload): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  actualizar(
    id: number,
    cliente: ClientePayload,
  ): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}${id}/`,
      cliente,
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}