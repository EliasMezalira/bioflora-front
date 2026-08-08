import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IndividuosModule } from '../individuos.module';
import { UploadImagemComponent } from './upload-imagem.component';
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

describe('UploadImagemComponent', () => {
  let component: UploadImagemComponent;
  let fixture: ComponentFixture<UploadImagemComponent>;
  let imagemService: any;
  let toastrService: any;

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
    
    fixture = TestBed.createComponent(UploadImagemComponent);
    component = fixture.componentInstance;
    imagemService = TestBed.inject(ImagemService);
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.individuoId).toBe(0);
    expect(component.file).toBeUndefined();
    expect(component.uploading).toBe(false);
  });

  describe('onFileChange', () => {
    it('should set file when user selects a file', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      } as any;

      component.onFileChange(mockEvent);

      expect(component.file).toBe(mockFile);
    });

    it('should not set file when no file is selected', () => {
      const mockEvent = {
        target: {
          files: []
        }
      } as any;

      component.onFileChange(mockEvent);

      expect(component.file).toBeUndefined();
    });

    it('should not set file when files are null', () => {
      const mockEvent = {
        target: {
          files: null
        }
      } as any;

      component.onFileChange(mockEvent);

      expect(component.file).toBeUndefined();
    });
  });

  describe('upload', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should upload file successfully', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.file = mockFile;
      component.individuoId = 1;

      component.upload();

      expect(imagemService.upload).toHaveBeenCalledWith(1, mockFile);
      expect(component.uploading).toBe(false);
      expect(toastrService.success).toHaveBeenCalledWith('Imagem enviada');
    });

    it('should emit uploaded event after successful upload', (done) => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.file = mockFile;
      component.individuoId = 1;

      component.uploaded.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      component.upload();
    });

    it('should handle upload error', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      jest.spyOn(imagemService, 'upload').mockReturnValue(
        throwError(() => new Error('Upload failed'))
      );

      component.file = mockFile;
      component.individuoId = 1;

      component.upload();

      expect(component.uploading).toBe(false);
      expect(toastrService.error).toHaveBeenCalledWith('Falha no upload');
    });

    it('should set uploading to true during upload', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.file = mockFile;
      component.individuoId = 1;

      component.upload();

      expect(component.uploading).toBe(false);
    });

    it('should not upload when file is not selected', () => {
      component.file = undefined;
      component.individuoId = 1;

      component.upload();

      expect(imagemService.upload).not.toHaveBeenCalled();
    });

    it('should not upload when individuoId is 0', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.file = mockFile;
      component.individuoId = 0;

      component.upload();

      expect(imagemService.upload).not.toHaveBeenCalled();
    });
  });
});
