import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PerfilModule } from '../perfil.module';
import { EditarPerfilComponent } from './editar-perfil.component';
import { AuthService } from '../../../core/services/auth.service';
import { IndividuoService } from '../../../core/services/individuo.service';
import { ImagemService } from '../../../core/services/imagem.service';
import { LevantamentoService } from '../../../core/services/levantamento.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const pageResponse = { content: [], page: 0, totalPages: 0 };
const activatedRouteStub = {
  snapshot: {
    paramMap: {
      get: () => '0'
    }
  }
};
const authServiceStub = {
  isAuthenticated: jest.fn(() => false),
  getAuthStatus: jest.fn(() => of(false)),
  getCurrentUser: jest.fn(() => of(null)),
  logout: jest.fn(),
  setCurrentUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn()
};
const individuoServiceStub = {
  listar: jest.fn(() => of(pageResponse)),
  listarPorLevantamento: jest.fn(() => of(pageResponse)),
  obter: jest.fn(() => of(null)),
  criar: jest.fn(() => of(null)),
  atualizar: jest.fn(() => of(null)),
  deletar: jest.fn(() => of(null)),
  completarComIA: jest.fn(() => of(null))
};
const levantamentoServiceStub = {
  listar: jest.fn(() => of(pageResponse)),
  listarPorUsuario: jest.fn(() => of(pageResponse)),
  obter: jest.fn(() => of(null)),
  criar: jest.fn(() => of(null)),
  atualizar: jest.fn(() => of(null))
};
const usuarioServiceStub = {
  atualizarUsuario: jest.fn(() => of({ id: 1, nome: 'Teste', email: 'teste@teste.com' }))
};
const imagemServiceStub = {
  listarPorIndividuo: jest.fn(() => of([])),
  upload: jest.fn(() => of(null)),
  deletar: jest.fn(() => of(null))
};
const toastrServiceStub = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn()
};
const modalStub = {
  open: jest.fn(() => ({ close: jest.fn() }))
};

describe('EditarPerfilComponent', () => {
  let component: EditarPerfilComponent;
  let fixture: ComponentFixture<EditarPerfilComponent>;

  const createComponent = (currentUser: any = null) => {
    authServiceStub.getCurrentUser.mockReturnValue(of(currentUser));
    fixture = TestBed.createComponent(EditarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
        { provide: IndividuoService, useValue: individuoServiceStub },
        { provide: ImagemService, useValue: imagemServiceStub },
        { provide: LevantamentoService, useValue: levantamentoServiceStub },
        { provide: UsuarioService, useValue: usuarioServiceStub },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: NgbModal, useValue: modalStub }
      ]
    })
    .compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should load the current user into the form when available', () => {
    createComponent({ id: 1, nome: 'Maria', email: 'maria@teste.com' });

    expect(component.user).toEqual({ id: 1, nome: 'Maria', email: 'maria@teste.com' });
    expect(component.form.value).toEqual({
      nome: 'Maria',
      email: 'maria@teste.com',
      senha: ''
    });
  });

  it('should not save when there is no current user', () => {
    createComponent();

    component.save();

    expect(usuarioServiceStub.atualizarUsuario).not.toHaveBeenCalled();
    expect(component.saving).toBe(false);
  });

  it('should not save when the form is invalid', () => {
    createComponent({ id: 1, nome: 'Maria', email: 'maria@teste.com' });

    component.form.patchValue({ email: 'invalid-email' });
    component.save();

    expect(usuarioServiceStub.atualizarUsuario).not.toHaveBeenCalled();
    expect(component.saving).toBe(false);
  });

  it('should save the profile successfully', () => {
    createComponent({ id: 1, nome: 'Maria', email: 'maria@teste.com' });
    const updatedUser = { id: 1, nome: 'Maria Silva', email: 'maria.silva@teste.com' };
    usuarioServiceStub.atualizarUsuario.mockReturnValueOnce(of(updatedUser));

    component.form.patchValue({
      nome: 'Maria Silva',
      email: 'maria.silva@teste.com',
      senha: ''
    });
    component.save();

    expect(usuarioServiceStub.atualizarUsuario).toHaveBeenCalledWith(1, {
      nome: 'Maria Silva',
      email: 'maria.silva@teste.com',
      senha: undefined
    });
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Perfil atualizado com sucesso');
    expect(authServiceStub.setCurrentUser).toHaveBeenCalledWith(updatedUser);
    expect(component.saving).toBe(false);
  });

  it('should show an error when saving fails', () => {
    createComponent({ id: 1, nome: 'Maria', email: 'maria@teste.com' });
    usuarioServiceStub.atualizarUsuario.mockReturnValueOnce(throwError(() => new Error('fail')));

    component.form.patchValue({
      nome: 'Maria Silva',
      email: 'maria.silva@teste.com'
    });
    component.save();

    expect(toastrServiceStub.error).toHaveBeenCalledWith('Erro ao atualizar perfil');
    expect(component.saving).toBe(false);
  });
});
