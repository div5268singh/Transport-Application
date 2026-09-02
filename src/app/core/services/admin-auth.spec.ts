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
<<<<<<< HEAD
    sessionStorage.clear();
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate via admin auth API', async () => {
<<<<<<< HEAD
    const loginPromise = service.login('admin', 'secret-pass');

    const request = httpTestingController.expectOne('/test-admin-auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'admin', password: 'secret-pass' });
    request.flush({ token: 'admin-jwt', expiresAt: '2026-09-03T00:00:00Z', username: 'admin' });

    await expectAsync(loginPromise).toBeResolvedTo(true);
    expect(service.getToken()).toBe('admin-jwt');
  });

  it('should return false without a stored token', async () => {
    const authPromise = service.isAuthenticated();
    await expectAsync(authPromise).toBeResolvedTo(false);
  });

  it('should read auth status when a token is stored', async () => {
    sessionStorage.setItem('santa-road-admin-jwt', 'admin-jwt');
=======
    const loginPromise = service.login('secret-pass');

    const request = httpTestingController.expectOne('/test-admin-auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ password: 'secret-pass' });
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ authenticated: true });

    await expectAsync(loginPromise).toBeResolvedTo(true);
  });

  it('should read auth status from admin auth API', async () => {
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    const authPromise = service.isAuthenticated();

    const request = httpTestingController.expectOne('/test-admin-auth/session');
    expect(request.request.method).toBe('GET');
<<<<<<< HEAD
    request.flush({ authenticated: true, username: 'admin' });

    await expectAsync(authPromise).toBeResolvedTo(true);
=======
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ authenticated: false });

    await expectAsync(authPromise).toBeResolvedTo(false);
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  });

  it('should call logout endpoint', async () => {
    const logoutPromise = service.logout();

    const request = httpTestingController.expectOne('/test-admin-auth/logout');
    expect(request.request.method).toBe('POST');
<<<<<<< HEAD
=======
    expect(request.request.withCredentials).toBeTrue();
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    request.flush(null);

    await expectAsync(logoutPromise).toBeResolved();
  });
});
