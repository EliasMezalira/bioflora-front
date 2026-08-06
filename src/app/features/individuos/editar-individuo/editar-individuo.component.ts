import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndividuoService } from '../../../core/services/individuo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-individuo',
  templateUrl: './editar-individuo.component.html',
  styleUrls: ['./editar-individuo.component.scss']
})
export class EditarIndividuoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  id = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: IndividuoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      parcela: ['', Validators.required],
      nomePopular: [''],
      nomeCientifico: [''],
      diametroCaule: [''],
      vivoMorto: ['vivo', Validators.required],
      dataLevantamento: ['', Validators.required]
    });

    if (this.id) {
      this.loading = true;
      this.service.obter(this.id).subscribe({
        next: (individuo) => {
          this.form.patchValue(individuo);
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
    this.service.atualizar(this.id, this.form.value).subscribe({
      next: () => {
        this.toastr.success('Indivíduo atualizado');
        this.router.navigate(['/individuos']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Erro ao atualizar indivíduo');
      }
    });
  }
}
