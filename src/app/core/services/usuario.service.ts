import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse } from '../models/page';
import { Usuario, UsuarioUpdateRequest } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private api: ApiService) {}

  getUsuario(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`/usuarios/${id}`);
  }

  atualizarUsuario(id: number, dados: UsuarioUpdateRequest): Observable<Usuario> {
    return this.api.put<Usuario>(`/usuarios/${id}`, dados);
  }

  deletarUsuario(id: number): Observable<void> {
    return this.api.delete<void>(`/usuarios/${id}`);
  }

  listarUsuarios(page = 0, size = 10): Observable<PageResponse<Usuario>> {
    return this.api.get<PageResponse<Usuario>>(`/usuarios?page=${page}&size=${size}`);
  }
}
