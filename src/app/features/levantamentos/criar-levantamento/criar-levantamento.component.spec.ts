import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LevantamentosModule } from '../levantamentos.module';
import { CriarLevantamentoComponent } from './criar-levantamento.component';
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

describe('CriarLevantamentoComponent', () => {
  let component: CriarLevantamentoComponent;
  let fixture: ComponentFixture<CriarLevantamentoComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevantamentosModule],
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

    fixture = TestBed.createComponent(CriarLevantamentoComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should return early if form is invalid', () => {
      component.form.markAllAsTouched();
      const createSpy = jest.spyOn(levantamentoServiceStub, 'criar');

      component.submit();

      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should call levantamentoService.criar with correct parameters when form is valid', () => {
      const formData = {
        nome: 'Levantamento Teste',
        bioma: 'Cerrado',
        descricao: 'Teste',
        cidade: 'Brasília',
        estado: 'DF',
        pais: 'Brasil'
      };
      component.form.patchValue(formData);
      const createSpy = jest.spyOn(levantamentoServiceStub, 'criar');

      component.submit();

      expect(createSpy).toHaveBeenCalledWith(0, formData);
    });

    it('should set saving to true before calling service', () => {
      component.form.patchValue({
        nome: 'Levantamento Teste',
        bioma: 'Cerrado',
        descricao: 'Teste',
        cidade: 'Brasília',
        estado: 'DF',
        pais: 'Brasil'
      });
      expect(component.saving).toBe(false);

      component.submit();

      expect(component.saving).toBe(true);
    });

    it('should show success toast and navigate on successful creation', fakeAsync(() => {
      const formData = {
        nome: 'Levantamento Teste',
        bioma: 'Cerrado',
        descricao: 'Teste',
        cidade: 'Brasília',
        estado: 'DF',
        pais: 'Brasil'
      };
      component.form.patchValue(formData);
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
      const toastrSuccessSpy = jest.spyOn(toastrServiceStub, 'success');

      component.submit();
      tick();

      expect(toastrSuccessSpy).toHaveBeenCalledWith('Levantamento criado');
      expect(navigateSpy).toHaveBeenCalledWith(['/levantamentos']);
    }));

    it('should show error toast and set saving to false on service error', fakeAsync(() => {
      const formData = {
        nome: 'Levantamento Teste',
        bioma: 'Cerrado',
        descricao: 'Teste',
        cidade: 'Brasília',
        estado: 'DF',
        pais: 'Brasil'
      };
      component.form.patchValue(formData);
      jest.spyOn(levantamentoServiceStub, 'criar').mockReturnValue(throwError(() => new Error('Service error')));
      const toastrErrorSpy = jest.spyOn(toastrServiceStub, 'error');

      component.submit();
      tick();

      expect(toastrErrorSpy).toHaveBeenCalledWith('Não foi possível criar o levantamento');
      expect(component.saving).toBe(false);
    }));
  });
});
