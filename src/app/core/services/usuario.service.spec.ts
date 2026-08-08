import { ApiService } from './api.service';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let api: jest.Mocked<Pick<ApiService, 'get' | 'put' | 'delete'>>;
  let service: UsuarioService;

  beforeEach(() => {
    api = {
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    service = new UsuarioService(api as unknown as ApiService);
  });

  it('should delegate user operations to ApiService', () => {
    service.getUsuario(1);
    service.atualizarUsuario(1, { nome: 'Novo', email: 'novo@bioflora.com' });
    service.deletarUsuario(1);
    service.listarUsuarios(2, 20);

    expect(api.get).toHaveBeenNthCalledWith(1, '/usuarios/1');
    expect(api.put).toHaveBeenCalledWith('/usuarios/1', { nome: 'Novo', email: 'novo@bioflora.com' });
    expect(api.delete).toHaveBeenCalledWith('/usuarios/1');
    expect(api.get).toHaveBeenNthCalledWith(2, '/usuarios?page=2&size=20');
  });
});