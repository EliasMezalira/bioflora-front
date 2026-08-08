import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { GaleriaImagensComponent } from './galeria-imagens.component';
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

describe('GaleriaImagensComponent', () => {
  let component: GaleriaImagensComponent;
  let fixture: ComponentFixture<GaleriaImagensComponent>;

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
    
    fixture = TestBed.createComponent(GaleriaImagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load images when individuoId changes to a valid value', () => {
    const images = [{ id: 1 } as any];
    const listarSpy = jest.spyOn(TestBed.inject(ImagemService), 'listarPorIndividuo').mockReturnValue(of(images));

    component.individuoId = 7;
    component.ngOnChanges({ individuoId: new SimpleChange(undefined, 7, true) });

    expect(listarSpy).toHaveBeenCalledWith(7);
    expect(component.imagens).toEqual(images);
    expect(component.loading).toBe(false);
  });

  it('should not load images when individuoId is falsy', () => {
    const listarSpy = jest.spyOn(TestBed.inject(ImagemService), 'listarPorIndividuo');

    component.individuoId = 0;
    component.ngOnChanges({ individuoId: new SimpleChange(undefined, 0, true) });

    expect(listarSpy).not.toHaveBeenCalled();
  });

  it('should set loading false when image loading fails', () => {
    jest.spyOn(TestBed.inject(ImagemService), 'listarPorIndividuo').mockReturnValue(throwError(() => new Error('fail')));

    component.individuoId = 3;
    component.loadImages();

    expect(component.loading).toBe(false);
  });

  it('should delete an image and reload the gallery on success', () => {
    const loadImagesSpy = jest.spyOn(component, 'loadImages');
    jest.spyOn(TestBed.inject(ImagemService), 'deletar').mockReturnValue(of(void 0));

    component.deleteImage(10);

    expect(loadImagesSpy).toHaveBeenCalled();
  });

  it('should ignore delete errors', () => {
    jest.spyOn(TestBed.inject(ImagemService), 'deletar').mockReturnValue(throwError(() => new Error('fail')));

    expect(() => component.deleteImage(10)).not.toThrow();
  });

  it('should build the image URL using the API base URL', () => {
    const image = { id: 42 } as any;

    expect(component.getImgURL(image)).toContain('/imagens/42');
  });
});
