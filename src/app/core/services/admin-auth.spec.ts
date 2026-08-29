import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AdminAuth } from './admin-auth';
import { AppConfig } from './app-config';

describe('AdminAuth', () => {
  let service: AdminAuth;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AppConfig,
          useValue: {
            getConfig: () => ({ admin: { authApiBaseUrl: '/test-admin-auth' } }),
          },
        },
      ],
    });
    service = TestBed.inject(AdminAuth);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate via admin auth API', async () => {
    const loginPromise = service.login('secret-pass');

    const request = httpTestingController.expectOne('/test-admin-auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ password: 'secret-pass' });
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ authenticated: true });

    await expectAsync(loginPromise).toBeResolvedTo(true);
  });

  it('should read auth status from admin auth API', async () => {
    const authPromise = service.isAuthenticated();

    const request = httpTestingController.expectOne('/test-admin-auth/session');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ authenticated: false });

    await expectAsync(authPromise).toBeResolvedTo(false);
  });

  it('should call logout endpoint', async () => {
    const logoutPromise = service.logout();

    const request = httpTestingController.expectOne('/test-admin-auth/logout');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    request.flush(null);

    await expectAsync(logoutPromise).toBeResolved();
  });
});
