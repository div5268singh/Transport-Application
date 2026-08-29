import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppConfig } from './app-config';
import { AppConfigModel } from '../models/app-config.model';

describe('AppConfig', () => {
  let service: AppConfig;
  let httpTestingController: HttpTestingController;

  const baseConfig: AppConfigModel = {
    appName: 'Santa Road',
    brand: {
      logoPath: 'assets/logo.svg',
    },
    contact: {
      phone: '+91-00000-00000',
      email: 'contact@example.com',
      address: 'Delhi',
    },
    seo: {
      defaultDescription: 'default description',
      keywords: ['k1', 'k2', 'k3', 'k4', 'k5'],
    },
    homepage: {
      heroHeading: 'Hero',
      heroSubheading: 'Sub Hero',
      banners: [],
      posters: [],
      videos: [],
    },
    about: {
      overview: 'About',
      operationalFootprint: [],
    },
    business: {
      services: [],
      features: [],
      clients: [],
    },
    admin: {},
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AppConfig);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ignore invalid stored override and fall back to base config', async () => {
    localStorage.setItem('santa-road-config-override', '{invalid-json');

    const loadPromise = service.loadConfig();

    const request = httpTestingController.expectOne('assets/config/app.config.json');
    expect(request.request.method).toBe('GET');
    request.flush(baseConfig);

    await expectAsync(loadPromise).toBeResolved();
    expect(service.getConfig().appName).toBe(baseConfig.appName);
    expect(localStorage.getItem('santa-road-config-override')).toBeNull();
  });
});
