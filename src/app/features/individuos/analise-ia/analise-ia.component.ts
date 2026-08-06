import { Component, Input } from '@angular/core';
import { IndividuoService } from '../../../core/services/individuo.service';
import { EspecieCompleta } from '../../../core/models/especieCompleta';

@Component({
  selector: 'app-analise-ia',
  templateUrl: './analise-ia.component.html',
  styleUrls: ['./analise-ia.component.scss']
})
export class AnaliseIaComponent {
  @Input() individuoId = 0;
  loading = false;
  result?: EspecieCompleta;
  error = false;

  constructor(private service: IndividuoService) {}

  analyze(): void {
    if (!this.individuoId) {
      return;
    }
    this.loading = true;
    this.error = false;
    this.service.completarComIA(this.individuoId).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
}
