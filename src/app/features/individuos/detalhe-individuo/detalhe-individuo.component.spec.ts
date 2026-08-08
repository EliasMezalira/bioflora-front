import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { DetalheIndividuoComponent } from './detalhe-individuo.component';
import { AuthService } from '../../../core/services/auth.service';
import { IndividuoService } from '../../../core/services/individuo.service';
import { ImagemService } from '../../../core/services/imagem.service';
import { LevantamentoService } from '../../../core/services/levantamento.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const pageResponse = { content: [], page: 0, totalPages: 0 };
let activatedRouteStub: {
  snapshot: {
    paramMap: {
      get: jest.Mock;
    };
  };
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

describe('DetalheIndividuoComponent', () => {
  let component: DetalheIndividuoComponent;
  let fixture: ComponentFixture<DetalheIndividuoComponent>;

  beforeEach(async () => {
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: jest.fn(() => '0')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [IndividuosModule],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
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
    
    fixture = TestBed.createComponent(DetalheIndividuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar o indivíduo quando há um id válido', () => {
    const individuoService = TestBed.inject(IndividuoService) as unknown as typeof individuoServiceStub;
    const individuo = { id: 1, nome: 'Teste' } as any;

    activatedRouteStub.snapshot.paramMap.get.mockReturnValue('1');
    individuoService.obter.mockReturnValue(of(individuo));

    component.ngOnInit();

    expect(individuoService.obter).toHaveBeenCalledWith(1);
    expect(component.id).toBe(1);
    expect(component.loading).toBeFalsy();
    expect(component.individuo).toEqual(individuo);
  });

  it('deve encerrar o loading quando a busca falhar', () => {
    const individuoService = TestBed.inject(IndividuoService) as unknown as typeof individuoServiceStub;

    activatedRouteStub.snapshot.paramMap.get.mockReturnValue('2');
    individuoService.obter.mockReturnValue(throwError(() => new Error('Erro')));

    component.ngOnInit();

    expect(individuoService.obter).toHaveBeenCalledWith(2);
    expect(component.loading).toBeFalsy();
  });
});
