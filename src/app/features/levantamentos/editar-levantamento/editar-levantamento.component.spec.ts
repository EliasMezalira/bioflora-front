import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LevantamentosModule } from '../levantamentos.module';
import { EditarLevantamentoComponent } from './editar-levantamento.component';
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
  obter: jest.fn(() => of(null as any)),
  criar: jest.fn(() => of(null as any)),
  atualizar: jest.fn(() => of(null as any))
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

describe('EditarLevantamentoComponent', () => {
  let component: EditarLevantamentoComponent;
  let fixture: ComponentFixture<EditarLevantamentoComponent>;
  let navigateSpy: jest.SpyInstance;
  const routeGetMock = activatedRouteStub.snapshot.paramMap.get as jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    routeGetMock.mockReturnValue('0');

    await TestBed.configureTestingModule({
      imports: [LevantamentosModule],
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

    fixture = TestBed.createComponent(EditarLevantamentoComponent);
    component = fixture.componentInstance;
    navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without loading an existing levantamento when id is missing', () => {
    expect(component.form).toBeTruthy();
    expect(component.id).toBe(0);
    expect(levantamentoServiceStub.obter).not.toHaveBeenCalled();
  });

  it('should load an existing levantamento and patch the form when id is present', () => {
    const levantamento = {
      nome: 'Levantamento teste',
      bioma: 'Cerrado',
      descricao: 'Descrição',
      cidade: 'Goiânia',
      estado: 'GO',
      pais: 'Brasil'
    };

    routeGetMock.mockReturnValue('12');
    levantamentoServiceStub.obter.mockReturnValue(of(levantamento));

    component.ngOnInit();

    expect(levantamentoServiceStub.obter).toHaveBeenCalledWith(12);
    expect(component.form.value.nome).toBe('Levantamento teste');
    expect(component.form.value.bioma).toBe('Cerrado');
    expect(component.loading).toBe(false);
  });

  it('should clear loading when loading an existing levantamento fails', () => {
    routeGetMock.mockReturnValue('12');
    levantamentoServiceStub.obter.mockReturnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(levantamentoServiceStub.obter).toHaveBeenCalledWith(12);
    expect(component.loading).toBe(false);
  });

  it('should not submit when the form is invalid', () => {
    component.submit();

    expect(levantamentoServiceStub.atualizar).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should submit and navigate to the list when the form is valid', fakeAsync(() => {
    component.form.patchValue({
      nome: 'Levantamento novo',
      bioma: 'Cerrado',
      cidade: 'Goiânia',
      estado: 'GO',
      pais: 'Brasil'
    });
    component.id = 7;

    fixture.ngZone!.run(() => component.submit());
    tick();

    expect(levantamentoServiceStub.atualizar).toHaveBeenCalledWith(7, component.form.value);
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Levantamento atualizado');
    expect(navigateSpy).toHaveBeenCalledWith(['/levantamentos']);
  }));

  it('should show an error and stop loading when submit fails', () => {
    component.form.patchValue({
      nome: 'Levantamento novo',
      bioma: 'Cerrado',
      cidade: 'Goiânia',
      estado: 'GO',
      pais: 'Brasil'
    });
    component.id = 7;
    levantamentoServiceStub.atualizar.mockReturnValue(throwError(() => new Error('fail')));

    component.submit();

    expect(levantamentoServiceStub.atualizar).toHaveBeenCalledWith(7, component.form.value);
    expect(component.loading).toBe(false);
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Erro ao atualizar levantamento');
  });

  it('should navigate to the list when cancel is called', fakeAsync(() => {
    fixture.ngZone!.run(() => component.cancelar());
    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/levantamentos']);
  }));
});
