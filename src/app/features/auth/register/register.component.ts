import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmSenha: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid || this.form.value.senha !== this.form.value.confirmSenha) {
      this.toastr.warning('Preencha os campos corretamente e confirme a senha');
      return;
    }
    this.loading = true;
    const { nome, email, senha } = this.form.value;
    this.authService.register({ nome, email, senha }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: () => {
        this.toastr.success('Cadastro realizado com sucesso');
        this.router.navigateByUrl('/auth/login');
      },
      error: () => {
        try {
          this.toastr.error('Não foi possível registrar o usuário');
        } catch {
          alert('Não foi possível registrar o usuário');
        }
      }
    });
  }
}
