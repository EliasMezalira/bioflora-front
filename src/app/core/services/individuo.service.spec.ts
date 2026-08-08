import { ApiService } from './api.service';
import { IndividuoService } from './individuo.service';

describe('IndividuoService', () => {
  let api: jest.Mocked<Pick<ApiService, 'get' | 'post' | 'put' | 'delete'>>;
  let service: IndividuoService;

  beforeEach(() => {
    api = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    service = new IndividuoService(api as unknown as ApiService);
  });

  it('should delegate individuo operations to ApiService', () => {
    service.criar(8, { parcela: 'A1', vivoMorto: 'vivo', dataLevantamento: '2026-08-07' });
    service.obter(2);
    service.atualizar(2, { parcela: 'A2', vivoMorto: 'morto', dataLevantamento: '2026-08-07' });
    service.deletar(2);
    service.listar(1, 5);
    service.listarPorLevantamento(8, 1, 5);
    service.completarComIA(2);

    expect(api.post).toHaveBeenNthCalledWith(1, '/individuos/levantamento/8', expect.any(Object));
    expect(api.get).toHaveBeenNthCalledWith(1, '/individuos/2');
    expect(api.put).toHaveBeenCalledWith('/individuos/2', expect.any(Object));
    expect(api.delete).toHaveBeenCalledWith('/individuos/2');
    expect(api.get).toHaveBeenNthCalledWith(2, '/individuos?page=1&size=5');
    expect(api.get).toHaveBeenNthCalledWith(3, '/individuos/levantamento/8?page=1&size=5');
    expect(api.post).toHaveBeenNthCalledWith(2, '/individuos/2/completar-dados-ia', {});
  });
});