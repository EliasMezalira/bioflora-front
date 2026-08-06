import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IndividuoService } from '../../../core/services/individuo.service';
import { Individuo } from '../../../core/models/individuo';

@Component({
  selector: 'app-detalhe-individuo',
  templateUrl: './detalhe-individuo.component.html',
  styleUrls: ['./detalhe-individuo.component.scss']
})
export class DetalheIndividuoComponent implements OnInit {
  individuo: Individuo | null = null;
  loading = false;
  id = 0;

  constructor(
    private route: ActivatedRoute,
    private service: IndividuoService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loading = true;
      this.service.obter(this.id).subscribe({
        next: (data) => {
          this.individuo = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
