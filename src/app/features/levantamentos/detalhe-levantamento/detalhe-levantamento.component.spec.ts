import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LevantamentosModule } from '../levantamentos.module';
import { DetalheLevantamentoComponent } from './detalhe-levantamento.component';
import { AuthService } from '../../../core/services/auth.service';
import { IndividuoService } from '../../../core/services/individuo.service';
import { ImagemService } from '../../../core/services/imagem.service';
import { LevantamentoService } from '../../../core/services/levantamento.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const pageResponse = { content: [], page: 0, totalPages: 0 };
const levantamentoResponse = {
  id: 12,
  nome: 'Levantamento teste',
  bioma: 'Cerrado',
  cidade: 'Goiânia',
  estado: 'GO',
  pais: 'Brasil'
};
const individuo = {
  id: 7,
  parcela: 'P-01',
  nomePopular: 'Ipê',
  nomeCientifico: 'Handroanthus albus',
  diametroCaule: 30,
  vivoMorto: 'vivo',
  dataLevantamento: '2026-08-07T10:15:00.000Z'
};
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
  obter: jest.fn(() => of({} as any)),
  criar: jest.fn(() => of(null)),
  atualizar: jest.fn(() => of(null)),
  deletar: jest.fn(() => of(null)),
  completarComIA: jest.fn(() => of(null))
};
const levantamentoServiceStub = {
  listar: jest.fn(() => of(pageResponse)),
  listarPorUsuario: jest.fn(() => of(pageResponse)),
  obter: jest.fn(() => of({} as any)),
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

describe('DetalheLevantamentoComponent', () => {
  let component: DetalheLevantamentoComponent;
  let fixture: ComponentFixture<DetalheLevantamentoComponent>;
  let modalRef: { close: jest.Mock; dismiss: jest.Mock };
  let navigateSpy: jest.SpyInstance;

  const routeGetMock = activatedRouteStub.snapshot.paramMap.get as jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    routeGetMock.mockReturnValue('0');
    modalRef = {
      close: jest.fn(),
      dismiss: jest.fn()
    };
    modalStub.open.mockReturnValue(modalRef);

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
    
    fixture = TestBed.createComponent(DetalheLevantamentoComponent);
    component = fixture.componentInstance;
    navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load the levantamento with its individuos', () => {
    routeGetMock.mockReturnValue('12');
    levantamentoServiceStub.obter.mockReturnValue(of(levantamentoResponse));
    individuoServiceStub.listarPorLevantamento.mockReturnValue(of(pageResponse));

    component.ngOnInit();

    expect(component.levantamentoId).toBe(12);
    expect(levantamentoServiceStub.obter).toHaveBeenCalledWith(12);
    expect(individuoServiceStub.listarPorLevantamento).toHaveBeenCalledWith(12, 0, 10);
    expect(component.individuoForm).toBeTruthy();
    expect(component.loading).toBe(false);
  });

  it('should clear loading when levantamento lookup fails', () => {
    routeGetMock.mockReturnValue('12');
    levantamentoServiceStub.obter.mockReturnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(levantamentoServiceStub.obter).toHaveBeenCalledWith(12);
    expect(component.loading).toBe(false);
    expect(component.levantamento).toBeNull();
  });

  it('should clear loading when individuos loading fails', () => {
    component.levantamentoId = 12;
    individuoServiceStub.listarPorLevantamento.mockReturnValue(throwError(() => new Error('fail')));

    component.loadIndividuos(0);

    expect(individuoServiceStub.listarPorLevantamento).toHaveBeenCalledWith(12, 0, 10);
    expect(component.loading).toBe(false);
  });

  it('should open the create and edit modals and map form values correctly', () => {
    component.initForm();

    component.openCreateModal({} as any);
    expect(component.isEditing).toBe(false);
    expect(component.editingId).toBeNull();
    expect(component.individuoForm.value.vivoMorto).toBe('vivo');
    expect(modalStub.open).toHaveBeenCalledWith({}, { size: 'lg', backdrop: 'static' });

    component.openEditModal(individuo as any, {} as any);
    expect(component.isEditing).toBe(true);
    expect(component.editingId).toBe(7);
    expect(component.individuoForm.value.parcela).toBe('P-01');
    expect(component.individuoForm.value.dataLevantamento).toBe('2026-08-07T10:15');
  });

  it('should warn when saving an invalid form and create or update when valid', () => {
    component.initForm();
    component.levantamentoId = 12;

    component.saveIndividuo(modalRef as any);

    expect(toastrServiceStub.warning).toHaveBeenCalled();
    expect(individuoServiceStub.criar).not.toHaveBeenCalled();

    component.individuoForm.patchValue({
      parcela: 'P-02',
      vivoMorto: 'vivo',
      dataLevantamento: '2026-08-07T10:15',
      diametroCaule: ''
    });

    component.saveIndividuo(modalRef as any);

    expect(individuoServiceStub.criar).toHaveBeenCalledWith(12, {
      parcela: 'P-02',
      nomePopular: '',
      nomeCientifico: '',
      vivoMorto: 'vivo',
      dataLevantamento: '2026-08-07T10:15'
    });
    expect(modalRef.close).toHaveBeenCalled();
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Indivíduo adicionado com sucesso');

    component.isEditing = true;
    component.editingId = 7;
    component.individuoForm.patchValue({ diametroCaule: '30' });

    component.saveIndividuo(modalRef as any);

    expect(individuoServiceStub.atualizar).toHaveBeenCalledWith(7, {
      parcela: 'P-02',
      nomePopular: '',
      nomeCientifico: '',
      diametroCaule: '30',
      vivoMorto: 'vivo',
      dataLevantamento: '2026-08-07T10:15'
    });
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Indivíduo atualizado com sucesso');
  });

  it('should show an error when creating an individuo fails', () => {
    component.initForm();
    component.levantamentoId = 12;
    component.individuoForm.patchValue({
      parcela: 'P-03',
      vivoMorto: 'vivo',
      dataLevantamento: '2026-08-07T10:15'
    });
    individuoServiceStub.criar.mockReturnValue(throwError(() => new Error('fail')));

    component.saveIndividuo(modalRef as any);

    expect(individuoServiceStub.criar).toHaveBeenCalledWith(12, {
      parcela: 'P-03',
      nomePopular: '',
      nomeCientifico: '',
      vivoMorto: 'vivo',
      dataLevantamento: '2026-08-07T10:15'
    });
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Erro ao adicionar indivíduo');
    expect(component.saving).toBe(false);
  });

  it('should show an error when updating an individuo fails', () => {
    component.initForm();
    component.levantamentoId = 12;
    component.isEditing = true;
    component.editingId = 7;
    component.individuoForm.patchValue({
      parcela: 'P-04',
      vivoMorto: 'morto',
      dataLevantamento: '2026-08-07T10:15'
    });
    individuoServiceStub.atualizar.mockReturnValue(throwError(() => new Error('fail')));

    component.saveIndividuo(modalRef as any);

    expect(individuoServiceStub.atualizar).toHaveBeenCalledWith(7, {
      parcela: 'P-04',
      nomePopular: '',
      nomeCientifico: '',
      vivoMorto: 'morto',
      dataLevantamento: '2026-08-07T10:15'
    });
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Erro ao atualizar indivíduo');
    expect(component.saving).toBe(false);
  });

  it('should confirm, delete, cancel delete and navigate to individuo details', () => {
    component.page = 2;
    component.confirmDelete(7);

    expect(component.individuoToDelete).toBe(7);
    expect(component.showDeleteModal).toBe(true);

    individuoServiceStub.deletar.mockReturnValue(of(null));
    component.executeDelete();

    expect(individuoServiceStub.deletar).toHaveBeenCalledWith(7);
    expect(toastrServiceStub.success).toHaveBeenCalledWith('Indivíduo removido com sucesso');
    expect(component.showDeleteModal).toBe(false);
    expect(component.individuoToDelete).toBeNull();

    component.confirmDelete(10);
    component.cancelDelete();

    expect(component.showDeleteModal).toBe(false);
    expect(component.individuoToDelete).toBeNull();

    component.viewIndividuo(55);
    expect(navigateSpy).toHaveBeenCalledWith(['/individuos', 55]);
  });
});
