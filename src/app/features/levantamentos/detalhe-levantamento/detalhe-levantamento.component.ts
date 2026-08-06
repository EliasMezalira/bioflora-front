import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Individuo } from '../../../core/models/individuo';
import { Levantamento } from '../../../core/models/levantamento';
import { IndividuoService } from '../../../core/services/individuo.service';
import { LevantamentoService } from '../../../core/services/levantamento.service';

@Component({
  selector: 'app-detalhe-levantamento',
  templateUrl: './detalhe-levantamento.component.html',
  styleUrls: ['./detalhe-levantamento.component.scss']
})
export class DetalheLevantamentoComponent implements OnInit {
  levantamento: Levantamento | null = null;
  individuos: Individuo[] = [];
  loading = false;
  levantamentoId = 0;
  page = 0;
  totalPages = 0;

  // Propriedades do Modal de Formulário
  individuoForm!: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  saving = false;

  // Propriedades do Modal de Exclusão
  showDeleteModal = false;
  individuoToDelete: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private levantamentoService: LevantamentoService,
    private individuoService: IndividuoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.levantamentoId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.levantamentoId) {
      return;
    }

    this.loading = true;
    this.levantamentoService.obter(this.levantamentoId).subscribe({
      next: (data) => {
        this.levantamento = data;
        this.loadIndividuos(0);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  initForm(): void {
    this.individuoForm = this.fb.group({
      parcela: ['', Validators.required],
      nomePopular: [''],
      nomeCientifico: [''],
      diametroCaule: [''],
      vivoMorto: ['vivo', Validators.required],
      dataLevantamento: ['', Validators.required]
    });
  }

  loadIndividuos(page = 0): void {
    this.loading = true;
    this.individuoService.listarPorLevantamento(this.levantamentoId, page, 10).subscribe({
      next: (response) => {
        this.individuos = response.content;
        this.page = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // --- CONTROLE DO MODAL CRIAR/EDITAR ---

  openCreateModal(content: any): void {
    this.isEditing = false;
    this.editingId = null;
    this.individuoForm.reset({ vivoMorto: 'vivo' });
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  openEditModal(individuo: Individuo, content: any): void {
    this.isEditing = true;
    this.editingId = individuo.id;

    // Formata a data para remover o sufixo de fuso (adequando ao input datetime-local)
    const dataFormatada = individuo.dataLevantamento ? individuo.dataLevantamento.substring(0, 16) : '';

    this.individuoForm.patchValue({
      parcela: individuo.parcela,
      nomePopular: individuo.nomePopular,
      nomeCientifico: individuo.nomeCientifico,
      diametroCaule: individuo.diametroCaule,
      vivoMorto: individuo.vivoMorto,
      dataLevantamento: dataFormatada
    });

    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  saveIndividuo(modal: any): void {
    // Se o formulário for inválido, exibe um alerta e destaca os campos
    if (this.individuoForm.invalid) {
      this.individuoForm.markAllAsTouched(); // Marca os campos para mostrar erros (se houver CSS para isso)
      this.toastr.warning('Por favor, preencha corretamente os campos obrigatórios (Parcela e Data do Levantamento).', 'Atenção');
      return;
    }

    this.saving = true;
    const payload = { ...this.individuoForm.value };

    if (!payload.diametroCaule) {
      delete payload.diametroCaule;
    }

    if (this.isEditing && this.editingId) {
      this.individuoService.atualizar(this.editingId, payload).subscribe({
        next: () => {
          this.toastr.success('Indivíduo atualizado com sucesso');
          this.saving = false;
          modal.close();
          this.loadIndividuos(this.page);
        },
        error: () => {
          this.toastr.error('Erro ao atualizar indivíduo');
          this.saving = false;
        }
      });
    } else {
      this.individuoService.criar(this.levantamentoId, payload).subscribe({
        next: () => {
          this.toastr.success('Indivíduo adicionado com sucesso');
          this.saving = false;
          modal.close();
          this.loadIndividuos(this.page);
        },
        error: () => {
          this.toastr.error('Erro ao adicionar indivíduo');
          this.saving = false;
        }
      });
    }
  }

  // --- CONTROLE DE EXCLUSÃO ---

  confirmDelete(id: number): void {
    this.individuoToDelete = id;
    this.showDeleteModal = true;
  }

  executeDelete(): void {
    if (!this.individuoToDelete) return;

    this.individuoService.deletar(this.individuoToDelete).subscribe({
      next: () => {
        this.toastr.success('Indivíduo removido com sucesso');
        this.showDeleteModal = false;
        this.individuoToDelete = null;
        this.loadIndividuos(this.page); // Recarrega a listagem
      },
      error: () => {
        this.toastr.error('Erro ao remover indivíduo');
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.individuoToDelete = null;
  }

  // --- NAVEGAÇÃO ---

  viewIndividuo(id: number): void {
    this.router.navigate(['/individuos', id]);
  }
}
