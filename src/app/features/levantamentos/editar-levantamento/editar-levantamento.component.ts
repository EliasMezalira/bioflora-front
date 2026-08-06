import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LevantamentoService } from '../../../core/services/levantamento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-levantamento',
  templateUrl: './editar-levantamento.component.html',
  styleUrls: ['./editar-levantamento.component.scss']
})
export class EditarLevantamentoComponent implements OnInit {
  form!: FormGroup;
  id = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private levantamentoService: LevantamentoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      bioma: ['', Validators.required],
      descricao: [''],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      pais: ['', Validators.required]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loading = true;
      this.levantamentoService.obter(this.id).subscribe({
        next: (lev) => {
          this.form.patchValue(lev);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.levantamentoService.atualizar(this.id, this.form.value).subscribe({
      next: () => {
        this.toastr.success('Levantamento atualizado');
        this.router.navigate(['/levantamentos']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Erro ao atualizar levantamento');
      }
    });
  }
}
