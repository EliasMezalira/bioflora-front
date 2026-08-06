import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {
  form!: FormGroup;
  user: Usuario | null = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['']
    });

    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      if (user) {
        this.form.patchValue({ nome: user.nome, email: user.email });
      }
    });
  }

  save(): void {
    if (!this.user || this.form.invalid) {
      return;
    }
    this.saving = true;
    const { nome, email, senha } = this.form.value;
    this.usuarioService.atualizarUsuario(this.user.id, { nome, email, senha: senha || undefined }).subscribe({
      next: (updated) => {
        this.toastr.success('Perfil atualizado com sucesso');
        this.authService.setCurrentUser(updated);
        this.saving = false;
      },
      error: () => {
        this.toastr.error('Erro ao atualizar perfil');
        this.saving = false;
      }
    });
  }
}
