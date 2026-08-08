import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthModule } from '../auth.module';
import { LoginComponent } from './login.component';
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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    const loginSpy = authServiceStub.login as jest.Mock;

    component.form.reset();
    component.submit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(toastrServiceStub.success).not.toHaveBeenCalled();
    expect(toastrServiceStub.error).not.toHaveBeenCalled();
  });

  it('should login and navigate to dashboard on success', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const loginSpy = authServiceStub.login as jest.Mock;

    loginSpy.mockReturnValue(of({ id: 1, nome: 'Usuário', email: 'teste@teste.com' }));
    component.form.setValue({ email: 'teste@teste.com', senha: '123456' });

    component.submit();

    expect(loginSpy).toHaveBeenCalledWith('teste@teste.com', '123456');
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Login realizado com sucesso');
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/dashboard');
    expect(toastrServiceStub.error).not.toHaveBeenCalled();
  });

  it('should show an error message when login fails', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');
    const loginSpy = authServiceStub.login as jest.Mock;

    loginSpy.mockReturnValue(throwError(() => new Error('Unauthorized')));
    component.form.setValue({ email: 'teste@teste.com', senha: '123456' });

    component.submit();

    expect(loginSpy).toHaveBeenCalledWith('teste@teste.com', '123456');
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Falha no login. Verifique suas credenciais.');
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
    expect(toastrServiceStub.success).not.toHaveBeenCalled();
  });
});
