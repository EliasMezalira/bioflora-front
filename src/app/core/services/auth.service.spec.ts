import { of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Usuario } from '../models/usuario';

describe('AuthService', () => {
  let api: jest.Mocked<Pick<ApiService, 'get' | 'post'>>;
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    api = {
      get: jest.fn(),
      post: jest.fn(),
    };
    service = new AuthService(api as unknown as ApiService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should login, persist token and load the current user', (done) => {
    api.post.mockReturnValue(of({ token: 'token-123', type: 'Bearer' }));
    api.get.mockReturnValue(of({
      id: 1,
      nome: 'Ana',
      email: 'ana@bioflora.com',
      dataCriacao: '2026-08-07',
    }));

    service.login('ana@bioflora.com', 'secret').subscribe((user) => {
      expect(user.nome).toBe('Ana');
      expect(localStorage.getItem('bioflora_token')).toBe('token-123');
      expect(localStorage.getItem('bioflora_user')).toContain('Ana');
      done();
    });
  });

  it('should register, update state and logout', () => {
    api.post.mockReturnValue(of({
      id: 2,
      nome: 'Bruno',
      email: 'bruno@bioflora.com',
      dataCriacao: '2026-08-07',
    }));

    service.register({ nome: 'Bruno', email: 'bruno@bioflora.com', senha: '123456' }).subscribe();
    service.setCurrentUser({
      id: 3,
      nome: 'Carla',
      email: 'carla@bioflora.com',
      dataCriacao: '2026-08-07',
    });

    let currentUser: Usuario | null = null;
    let authStatus: boolean | null = null;
    service.getCurrentUser().subscribe((user) => {
      currentUser = user;
    });
    service.getAuthStatus().subscribe((status) => {
      authStatus = status;
    });

    expect(currentUser).toEqual(expect.objectContaining({ nome: 'Carla' }));
    expect(authStatus).toBe(true);
    expect(localStorage.getItem('bioflora_user')).toContain('Carla');

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('bioflora_token')).toBeNull();
    expect(localStorage.getItem('bioflora_user')).toBeNull();
  });
});