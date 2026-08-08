import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthModule } from '../auth.module';
import { RegisterComponent } from './register.component';
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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [AuthModule],
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should warn and stop when form is invalid or passwords do not match', () => {
    component.form.patchValue({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456',
      confirmSenha: '1234567'
    });

    component.submit();

    expect(toastrServiceStub.warning).toHaveBeenCalledWith('Preencha os campos corretamente e confirme a senha');
    expect(authServiceStub.register).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should register and redirect on success', () => {
    authServiceStub.register.mockReturnValueOnce(of({ id: 1 }));
    component.form.patchValue({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456',
      confirmSenha: '123456'
    });

    component.submit();

    expect(authServiceStub.register).toHaveBeenCalledWith({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456'
    });
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Cadastro realizado com sucesso');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    expect(component.loading).toBe(false);
  });

  it('should show an error toast when registration fails', () => {
    authServiceStub.register.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.form.patchValue({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456',
      confirmSenha: '123456'
    });

    component.submit();

    expect(authServiceStub.register).toHaveBeenCalled();
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Não foi possível registrar o usuário');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });
});
