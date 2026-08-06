import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ImagemResponse } from '../models/imagem';

@Injectable({ providedIn: 'root' })
export class ImagemService {
  constructor(private api: ApiService) {}

  upload(individuoId: number, file: File): Observable<ImagemResponse> {
    const formData = new FormData();
    formData.append('arquivo', file);
    return this.api.postFormData<ImagemResponse>(`/imagens/individuo/${individuoId}`, formData);
  }

  obter(id: number): Observable<Blob> {
    return this.api.get<Blob>(`/imagens/${id}`);
  }

  listarPorIndividuo(individuoId: number): Observable<ImagemResponse[]> {
    return this.api.get<ImagemResponse[]>(`/imagens/individuo/${individuoId}`);
  }

  deletar(id: number): Observable<void> {
    return this.api.delete<void>(`/imagens/${id}`);
  }
}
