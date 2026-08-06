import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Levantamento } from '../../../core/models/levantamento';
import { LevantamentoService } from '../../../core/services/levantamento.service';

@Component({
  selector: 'app-listar-levantamentos',
  templateUrl: './listar-levantamentos.component.html',
  styleUrls: ['./listar-levantamentos.component.scss']
})
export class ListarLevantamentosComponent implements OnInit {
  levantamentos: Levantamento[] = [];
  page = 0;
  totalPages = 0;
  loading = false;
  private usuarioId?: number;

  constructor(
    private levantamentoService: LevantamentoService,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.usuarioId = user?.id;
      this.loadPage(0);
    });
  }

  loadPage(page = 0): void {
    this.loading = true;
    const request = this.usuarioId
      ? this.levantamentoService.listarPorUsuario(this.usuarioId, page, 10)
      : this.levantamentoService.listar(page, 10);

    request.subscribe({
      next: (response) => {
        this.levantamentos = response.content;
        this.page = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/levantamentos/editar', id]);
  }

  detail(id: number): void {
    this.router.navigate(['/levantamentos', id]);
  }
}
