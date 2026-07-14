import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import {
  LoginRequest,
  TokenResponse,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly tokenUrl = 'http://localhost:8000/api/token/';
  private readonly refreshUrl =
    'http://localhost:8000/api/token/refresh/';

  private readonly accessTokenKey = 'vetcare_access_token';
  private readonly refreshTokenKey = 'vetcare_refresh_token';

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(this.tokenUrl, credentials)
      .pipe(
        tap((tokens) => {
          this.saveTokens(tokens);
        }),
      );
  }

  refreshToken(): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(this.refreshUrl, {
      refresh: this.getRefreshToken(),
    });
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  private saveTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.accessTokenKey, tokens.access);
    localStorage.setItem(this.refreshTokenKey, tokens.refresh);
  }
}