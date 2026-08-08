import { ApiService } from './api.service';
import { ImagemService } from './imagem.service';

describe('ImagemService', () => {
  let api: jest.Mocked<Pick<ApiService, 'get' | 'delete' | 'postFormData'>>;
  let service: ImagemService;

  beforeEach(() => {
    api = {
      get: jest.fn(),
      delete: jest.fn(),
      postFormData: jest.fn(),
    };
    service = new ImagemService(api as unknown as ApiService);
  });

  it('should upload, list, fetch and delete images', () => {
    const file = new File(['image-bytes'], 'foto.jpg', { type: 'image/jpeg' });

    service.upload(10, file);
    service.obter(3);
    service.listarPorIndividuo(10);
    service.deletar(7);

    expect(api.postFormData).toHaveBeenCalledTimes(1);
    expect(api.postFormData).toHaveBeenCalledWith('/imagens/individuo/10', expect.any(FormData));
    expect(api.get).toHaveBeenNthCalledWith(1, '/imagens/3');
    expect(api.get).toHaveBeenNthCalledWith(2, '/imagens/individuo/10');
    expect(api.delete).toHaveBeenCalledWith('/imagens/7');
  });
});