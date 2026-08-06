import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndividuoService } from '../../../core/services/individuo.service';
import { Individuo } from '../../../core/models/individuo';

@Component({
  selector: 'app-listar-individuos',
  templateUrl: './listar-individuos.component.html',
  styleUrls: ['./listar-individuos.component.scss']
})
export class ListarIndividuosComponent implements OnInit {
  individuos: Individuo[] = [];
  page = 0;
  totalPages = 0;
  loading = false;

  constructor(private individuoService: IndividuoService, private router: Router) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.individuoService.listar(page, 10).subscribe({
      next: (pageResponse) => {
        this.individuos = pageResponse.content;
        this.page = pageResponse.page;
        this.totalPages = pageResponse.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  create(): void {
    this.router.navigate(['/individuos/criar', 0]);
  }

  edit(id: number): void {
    this.router.navigate(['/individuos/editar', id]);
  }

  detail(id: number): void {
    this.router.navigate(['/individuos', id]);
  }
}
