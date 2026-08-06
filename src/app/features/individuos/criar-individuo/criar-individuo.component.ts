import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndividuoService } from '../../../core/services/individuo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-criar-individuo',
  templateUrl: './criar-individuo.component.html',
  styleUrls: ['./criar-individuo.component.scss']
})
export class CriarIndividuoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  levantamentoId = 0;

  constructor(
    private fb: FormBuilder,
    private service: IndividuoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.levantamentoId = Number(this.route.snapshot.paramMap.get('levantamentoId')) || 0;
    this.form = this.fb.group({
      parcela: ['', Validators.required],
      nomePopular: [''],
      nomeCientifico: [''],
      diametroCaule: [''],
      vivoMorto: ['vivo', Validators.required],
      dataLevantamento: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid || !this.levantamentoId) {
      return;
    }
    this.loading = true;
    const payload = { ...this.form.value };
    if (!payload.diametroCaule) {
      delete payload.diametroCaule;
    }
    this.service.criar(this.levantamentoId, payload).subscribe({
      next: () => {
        this.toastr.success('Indivíduo criado');
        this.router.navigate(['/individuos']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Erro ao criar indivíduo');
      }
    });
  }
}
