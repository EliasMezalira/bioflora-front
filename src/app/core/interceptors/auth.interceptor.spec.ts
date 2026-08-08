import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authService: jest.Mocked<Pick<AuthService, 'getToken' | 'logout'>>;
  let router: jest.Mocked<Pick<Router, 'navigate'>>;

  beforeEach(() => {
    authService = {
      getToken: jest.fn(),
      logout: jest.fn(),
    };
    router = {
      navigate: jest.fn(),
    };

    interceptor = new AuthInterceptor(authService as unknown as AuthService, router as unknown as Router);
  });

  it('should add the Authorization header when a token exists', () => {
    authService.getToken.mockReturnValue('token-123');
    const request = new HttpRequest('GET', '/usuarios');
    let forwardedRequest: HttpRequest<unknown> | undefined;
    const next: HttpHandler = {
      handle: (req) => {
        forwardedRequest = req;
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, next).subscribe();

    expect(forwardedRequest?.headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('should forward the request unchanged when there is no token', () => {
    authService.getToken.mockReturnValue(null);
    const request = new HttpRequest('GET', '/usuarios');
    let forwardedRequest: HttpRequest<unknown> | undefined;
    const next: HttpHandler = {
      handle: (req) => {
        forwardedRequest = req;
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, next).subscribe();

    expect(forwardedRequest).toBe(request);
    expect(forwardedRequest?.headers.has('Authorization')).toBe(false);
  });

  it('should logout and redirect to login on 401 responses', () => {
    authService.getToken.mockReturnValue('token-123');
    const request = new HttpRequest('GET', '/usuarios');
    const unauthorizedError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    const next: HttpHandler = {
      handle: () => throwError(() => unauthorizedError),
    };

    let capturedError: HttpErrorResponse | undefined;

    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        capturedError = error;
      },
    });

    expect(capturedError).toBe(unauthorizedError);
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
