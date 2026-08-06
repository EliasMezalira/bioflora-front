import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Individuo, IndividuoCreateRequest } from '../models/individuo';
import { PageResponse } from '../models/page';
import { EspecieCompleta } from '../models/especieCompleta';

@Injectable({ providedIn: 'root' })
export class IndividuoService {
  constructor(private api: ApiService) {}

  criar(levantamentoId: number, dados: IndividuoCreateRequest): Observable<Individuo> {
    return this.api.post<Individuo>(`/individuos/levantamento/${levantamentoId}`, dados);
  }

  obter(id: number): Observable<Individuo> {
    return this.api.get<Individuo>(`/individuos/${id}`);
  }

  atualizar(id: number, dados: IndividuoCreateRequest): Observable<Individuo> {
    return this.api.put<Individuo>(`/individuos/${id}`, dados);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`/individuos/${id}`);
  }

  listar(page = 0, size = 10): Observable<PageResponse<Individuo>> {
    return this.api.get<PageResponse<Individuo>>(`/individuos?page=${page}&size=${size}`);
  }

  listarPorLevantamento(levantamentoId: number, page = 0, size = 10): Observable<PageResponse<Individuo>> {
    return this.api.get<PageResponse<Individuo>>(`/individuos/levantamento/${levantamentoId}?page=${page}&size=${size}`);
  }

  completarComIA(id: number): Observable<EspecieCompleta> {
    return this.api.post<EspecieCompleta>(`/individuos/${id}/completar-dados-ia`, {});
  }
}
