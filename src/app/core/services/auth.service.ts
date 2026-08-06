import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TokenResponse } from '../models/token-response';
import { Usuario, UsuarioCreateRequest, UsuarioUpdateRequest } from '../models/usuario';

const TOKEN_KEY = 'bioflora_token';
const USER_KEY = 'bioflora_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.loadUser());
  private authenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private api: ApiService) {}

  login(email: string, senha: string): Observable<Usuario> {
    return this.api.post<TokenResponse>('/login', { email, senha }).pipe(
      tap((response) => {
        this.setToken(response.token);
      }),
      switchMap(() => this.api.get<Usuario>('/usuarios/me').pipe(
        tap((user) => {
          this.setUser(user);
        })
      ))
    );
  }

  register(usuario: UsuarioCreateRequest): Observable<Usuario> {
    return this.api.post<Usuario>('/usuarios', usuario).pipe(
      tap((user) => {
        this.setUser(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUserSubject.asObservable();
  }

  getAuthStatus(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  setCurrentUser(user: Usuario): void {
    this.setUser(user);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private setUser(user: Usuario): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.authenticatedSubject.next(true);
  }

  private loadUser(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
