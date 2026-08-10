import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LevantamentoService } from '../../../core/services/levantamento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-criar-levantamento',
  templateUrl: './criar-levantamento.component.html',
  styleUrls: ['./criar-levantamento.component.scss']
})
export class CriarLevantamentoComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  private usuarioId?: number;

  constructor(
    private fb: FormBuilder,
    private levantamentoService: LevantamentoService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.usuarioId = user?.id;
    });
    this.form = this.fb.group({
      nome: ['', Validators.required],
      bioma: ['', Validators.required],
      descricao: [''],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      pais: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    this.levantamentoService.criar(this.usuarioId ? this.usuarioId : 0 , this.form.value).subscribe({
      next: () => {
        this.toastr.success('Levantamento criado');
        this.router.navigate(['/levantamentos']);
      },
      error: () => {
        this.saving = false;
        this.toastr.error('Não foi possível criar o levantamento');
      }
    });
  }
}
