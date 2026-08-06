import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Levantamento, LevantamentoCreateRequest } from '../models/levantamento';
import { PageResponse } from '../models/page';

@Injectable({ providedIn: 'root' })
export class LevantamentoService {
  constructor(private api: ApiService) {}

  criar(usuarioId: number, dados: LevantamentoCreateRequest): Observable<Levantamento> {
    return this.api.post<Levantamento>(`/levantamentos?usuarioId=${usuarioId}`, dados);
  }

  obter(id: number): Observable<Levantamento> {
    return this.api.get<Levantamento>(`/levantamentos/${id}`);
  }

  atualizar(id: number, dados: LevantamentoCreateRequest): Observable<Levantamento> {
    return this.api.put<Levantamento>(`/levantamentos/${id}`, dados);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`/levantamentos/${id}`);
  }

  listar(page = 0, size = 10): Observable<PageResponse<Levantamento>> {
    return this.api.get<PageResponse<Levantamento>>(`/levantamentos?page=${page}&size=${size}`);
  }

  listarPorUsuario(usuarioId: number, page = 0, size = 10): Observable<PageResponse<Levantamento>> {
    return this.api.get<PageResponse<Levantamento>>(`/levantamentos/usuario/${usuarioId}?page=${page}&size=${size}`);
  }
}
