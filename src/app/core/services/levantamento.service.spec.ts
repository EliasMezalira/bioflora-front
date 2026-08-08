import { ApiService } from './api.service';
import { LevantamentoService } from './levantamento.service';

describe('LevantamentoService', () => {
  let api: jest.Mocked<Pick<ApiService, 'get' | 'post' | 'put' | 'delete'>>;
  let service: LevantamentoService;

  beforeEach(() => {
    api = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    service = new LevantamentoService(api as unknown as ApiService);
  });

  it('should delegate levantamento operations to ApiService', () => {
    service.criar(4, { nome: 'Área 1', bioma: 'Mata Atlântica', cidade: 'Curitiba', estado: 'PR', pais: 'Brasil' });
    service.obter(2);
    service.atualizar(2, { nome: 'Área 2', bioma: 'Cerrado', cidade: 'Goiânia', estado: 'GO', pais: 'Brasil' });
    service.deletar(2);
    service.listar(1, 5);
    service.listarPorUsuario(9, 1, 5);

    expect(api.post).toHaveBeenCalledWith('/levantamentos?usuarioId=4', expect.any(Object));
    expect(api.get).toHaveBeenNthCalledWith(1, '/levantamentos/2');
    expect(api.put).toHaveBeenCalledWith('/levantamentos/2', expect.any(Object));
    expect(api.delete).toHaveBeenCalledWith('/levantamentos/2');
    expect(api.get).toHaveBeenNthCalledWith(2, '/levantamentos?page=1&size=5');
    expect(api.get).toHaveBeenNthCalledWith(3, '/levantamentos/usuario/9?page=1&size=5');
  });
});