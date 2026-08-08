import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { EditarIndividuoComponent } from './editar-individuo.component';
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
      get: jest.fn(() => '0')
    }
  }
};
const routerStub = {
  navigate: jest.fn()
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
const individuoServiceStub: any = {
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

describe('EditarIndividuoComponent', () => {
  let component: EditarIndividuoComponent;
  let fixture: ComponentFixture<EditarIndividuoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividuosModule],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
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
    
    fixture = TestBed.createComponent(EditarIndividuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form without loading an individuo when id is missing', () => {
    activatedRouteStub.snapshot.paramMap.get.mockReturnValue('0');

    component.ngOnInit();

    expect(component.id).toBe(0);
    expect(component.form.get('parcela')?.value).toBe('');
    expect(component.loading).toBe(false);
    expect(individuoServiceStub.obter).not.toHaveBeenCalled();
  });

  it('should load an individuo and patch the form when id exists', () => {
    const individuo = {
      parcela: 'P1',
      nomePopular: 'Nome popular',
      nomeCientifico: 'Nome científico',
      diametroCaule: 12,
      vivoMorto: 'morto',
      dataLevantamento: '2024-01-01'
    };

    activatedRouteStub.snapshot.paramMap.get.mockReturnValue('7');
    individuoServiceStub.obter.mockReturnValue(of(individuo));

    component.ngOnInit();

    expect(individuoServiceStub.obter).toHaveBeenCalledWith(7);
    expect(component.form.get('parcela')?.value).toBe('P1');
    expect(component.form.get('nomePopular')?.value).toBe('Nome popular');
    expect(component.loading).toBe(false);
  });

  it('should stop loading when loading an individuo fails', () => {
    activatedRouteStub.snapshot.paramMap.get.mockReturnValue('7');
    individuoServiceStub.obter.mockReturnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(individuoServiceStub.obter).toHaveBeenCalledWith(7);
    expect(component.loading).toBe(false);
  });

  it('should not submit when the form is invalid', () => {
    component.form.reset();

    component.submit();

    expect(individuoServiceStub.atualizar).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should update an individuo and navigate on success', () => {
    component.id = 7;
    component.form.patchValue({
      parcela: 'P1',
      nomePopular: 'Nome popular',
      nomeCientifico: 'Nome científico',
      diametroCaule: '12',
      vivoMorto: 'vivo',
      dataLevantamento: '2024-01-01'
    });

    component.submit();

    expect(individuoServiceStub.atualizar).toHaveBeenCalledWith(7, component.form.value);
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Indivíduo atualizado');
    expect(routerStub.navigate).toHaveBeenCalledWith(['/individuos']);
  });

  it('should show an error message when the update request fails', () => {
    component.id = 7;
    component.form.patchValue({
      parcela: 'P1',
      nomePopular: 'Nome popular',
      nomeCientifico: 'Nome científico',
      diametroCaule: '12',
      vivoMorto: 'vivo',
      dataLevantamento: '2024-01-01'
    });
    individuoServiceStub.atualizar.mockReturnValue(throwError(() => new Error('fail')));

    component.submit();

    expect(component.loading).toBe(false);
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Erro ao atualizar indivíduo');
  });
});
