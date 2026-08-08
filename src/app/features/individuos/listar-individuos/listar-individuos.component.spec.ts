import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { ListarIndividuosComponent } from './listar-individuos.component';
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

describe('ListarIndividuosComponent', () => {
  let component: ListarIndividuosComponent;
  let fixture: ComponentFixture<ListarIndividuosComponent>;
  let router: Router;

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
    
    fixture = TestBed.createComponent(ListarIndividuosComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.create();

    expect(navigateSpy).toHaveBeenCalledWith(['/individuos/criar', 0]);
  });

  it('should navigate to edit page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.edit(5);

    expect(navigateSpy).toHaveBeenCalledWith(['/individuos/editar', 5]);
  });

  it('should navigate to detail page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.detail(7);

    expect(navigateSpy).toHaveBeenCalledWith(['/individuos', 7]);
  });

  it('should stop loading when listar fails', () => {
    jest.spyOn(individuoServiceStub, 'listar').mockReturnValueOnce(throwError(() => new Error('fail')));

    component.loadPage();

    expect(component.loading).toBe(false);
  });
});
