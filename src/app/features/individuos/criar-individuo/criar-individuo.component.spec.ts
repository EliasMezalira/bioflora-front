import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { CriarIndividuoComponent } from './criar-individuo.component';
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

describe('CriarIndividuoComponent', () => {
  let component: CriarIndividuoComponent;
  let fixture: ComponentFixture<CriarIndividuoComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [IndividuosModule],
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
    
    fixture = TestBed.createComponent(CriarIndividuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when the form is invalid', () => {
    component.form.reset();
    component.levantamentoId = 7;

    component.submit();

    expect(individuoServiceStub.criar).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should not submit when the levantamento id is missing', () => {
    component.form.patchValue({
      parcela: 'P1',
      vivoMorto: 'vivo',
      dataLevantamento: '2024-01-01'
    });
    component.levantamentoId = 0;

    component.submit();

    expect(individuoServiceStub.criar).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should submit the payload without diametroCaule and navigate on success', () => {
    const createSpy = individuoServiceStub.criar as jest.Mock;
    const routerStub = TestBed.inject(Router)
    const routerNavigateSpy = jest.spyOn(routerStub, 'navigate');

    component.levantamentoId = 7;
    component.form.patchValue({
      parcela: 'P1',
      nomePopular: 'Nome popular',
      nomeCientifico: 'Nome científico',
      diametroCaule: '',
      vivoMorto: 'vivo',
      dataLevantamento: '2024-01-01'
    });

    component.submit();

    expect(createSpy).toHaveBeenCalledWith(7, {
      parcela: 'P1',
      nomePopular: 'Nome popular',
      nomeCientifico: 'Nome científico',
      vivoMorto: 'vivo',
      dataLevantamento: '2024-01-01'
    });
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Indivíduo criado');
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/individuos']);
  });

  it('should reset loading and show an error toast when creation fails', () => {
    component.levantamentoId = 7;
    component.form.patchValue({
      parcela: 'P1',
      vivoMorto: 'vivo',
      dataLevantamento: '2024-01-01'
    });
    (individuoServiceStub.criar as jest.Mock).mockReturnValueOnce(throwError(() => new Error('fail')));

    component.submit();

    expect(component.loading).toBe(false);
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Erro ao criar indivíduo');
  });
});
