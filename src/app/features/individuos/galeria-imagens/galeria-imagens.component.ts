import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ImagemResponse } from '../../../core/models/imagem';
import { ImagemService } from '../../../core/services/imagem.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-galeria-imagens',
  templateUrl: './galeria-imagens.component.html',
  styleUrls: ['./galeria-imagens.component.scss']
})
export class GaleriaImagensComponent implements OnChanges {
  @Input() individuoId = 0;
  imagens: ImagemResponse[] = [];
  loading = false;

  constructor(private imagemService: ImagemService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['individuoId'] && this.individuoId) {
      this.loadImages();
    }
  }

  loadImages(): void {
    this.loading = true;
    this.imagemService.listarPorIndividuo(this.individuoId).subscribe({
      next: (items) => {
        this.imagens = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteImage(id: number): void {
    this.imagemService.deletar(id).subscribe({
      next: () => this.loadImages(),
      error: () => {}
    });
  }

  getImgURL(imagem: ImagemResponse): string {
    return environment.apiUrl + `/imagens/${imagem.id}`;
  }
}
