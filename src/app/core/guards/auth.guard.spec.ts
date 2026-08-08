import { TestBed } from '@angular/core/testing';
import { UrlTree, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: Partial<AuthService>;
  let router: Partial<Router>;
  const fakeUrlTree = {} as UrlTree;

  beforeEach(() => {
    authService = { isAuthenticated: jest.fn() };
    router = { createUrlTree: jest.fn().mockReturnValue(fakeUrlTree) };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('permite acesso quando o usuário está autenticado', () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('redireciona para /auth/login quando não autenticado', () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
    const result = guard.canActivate();
    expect(result).toBe(fakeUrlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });
});
