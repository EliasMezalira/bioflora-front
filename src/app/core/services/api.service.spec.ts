import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let http: jest.Mocked<Pick<HttpClient, 'get' | 'post' | 'put' | 'delete'>>;
  let service: ApiService;

  beforeEach(() => {
    http = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    service = new ApiService(http as unknown as HttpClient);
  });

  it('should build urls with and without a leading slash', () => {
    http.get.mockReturnValue(of(null));
    http.post.mockReturnValue(of(null));

    service.get('/usuarios').subscribe();
    service.post('usuarios', {});

    expect(http.get).toHaveBeenCalledWith(expect.stringContaining('/usuarios'), { params: undefined });
    expect(http.post).toHaveBeenCalledWith(expect.stringContaining('/usuarios'), {});
  });

  it('should forward requests to HttpClient', () => {
    http.put.mockReturnValue(of(null));
    http.delete.mockReturnValue(of(null));

    service.put('/usuarios/1', { nome: 'Novo nome' });
    service.delete('/usuarios/1');

    expect(http.put).toHaveBeenCalledWith(expect.stringContaining('/usuarios/1'), { nome: 'Novo nome' });
    expect(http.delete).toHaveBeenCalledWith(expect.stringContaining('/usuarios/1'));
  });
});