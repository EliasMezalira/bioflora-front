import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { AnaliseIaComponent } from './analise-ia.component';
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

describe('AnaliseIaComponent', () => {
  let component: AnaliseIaComponent;
  let fixture: ComponentFixture<AnaliseIaComponent>;

  beforeEach(async () => {
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
    
    fixture = TestBed.createComponent(AnaliseIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call the service when individuoId is missing', () => {
    component.individuoId = 0;

    component.analyze();

    expect(individuoServiceStub.completarComIA).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should call the service and set the result on success', () => {
    const result = { id: 7, nomeCientifico: 'Species test' } as any;
    const subject = new Subject<any>();
    individuoServiceStub.completarComIA.mockReturnValue(subject.asObservable());

    component.individuoId = 7;
    component.analyze();

    expect(component.loading).toBe(true);
    expect(component.error).toBe(false);
    expect(individuoServiceStub.completarComIA).toHaveBeenCalledWith(7);

    subject.next(result);

    expect(component.result).toEqual(result);
    expect(component.loading).toBe(false);
  });

  it('should handle service errors by setting the error flag', () => {
    individuoServiceStub.completarComIA.mockReturnValue(throwError(() => new Error('Erro')));

    component.individuoId = 8;
    component.analyze();

    expect(individuoServiceStub.completarComIA).toHaveBeenCalledWith(8);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(true);
  });
});
