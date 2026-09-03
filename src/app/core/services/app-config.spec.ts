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
    content: {},
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

  it('should ignore an invalid browser cache and load database content', async () => {
    localStorage.setItem('santa-road-site-content', '{invalid-json');

    const loadPromise = service.loadConfig();

    const request = httpTestingController.expectOne('assets/config/app.config.json');
    expect(request.request.method).toBe('GET');
    request.flush(baseConfig);
    await Promise.resolve();

    const contentRequest = httpTestingController.expectOne('/api/content');
    contentRequest.flush({ jsonData: JSON.stringify(baseConfig), updatedAt: new Date().toISOString() });

    await expectAsync(loadPromise).toBeResolved();
    expect(service.getConfig().appName).toBe(baseConfig.appName);
    expect(JSON.parse(localStorage.getItem('santa-road-site-content') ?? '{}')).toEqual({
      ...baseConfig,
      contact: { ...baseConfig.contact, leadEmail: baseConfig.contact.email },
    });
  });

  it('should use the browser cache when the content API is unavailable', async () => {
    const cachedConfig = { ...baseConfig, appName: 'Cached Santa Road' };
    localStorage.setItem('santa-road-site-content', JSON.stringify(cachedConfig));

    const loadPromise = service.loadConfig();
    httpTestingController.expectOne('assets/config/app.config.json').flush(baseConfig);
    await Promise.resolve();
    httpTestingController.expectOne('/api/content').flush('Unavailable', { status: 503, statusText: 'Unavailable' });

    await expectAsync(loadPromise).toBeResolved();
    expect(service.getConfig().appName).toBe('Cached Santa Road');
  });

  it('should update the shared config reference and cache after a successful save', async () => {
    const loadPromise = service.loadConfig();
    httpTestingController.expectOne('assets/config/app.config.json').flush(baseConfig);
    await Promise.resolve();
    httpTestingController.expectOne('/api/content').flush({
      jsonData: JSON.stringify(baseConfig),
      updatedAt: new Date().toISOString(),
    });
    await loadPromise;

    const sharedConfig = service.getConfig();
    const nextConfig = service.getEditableConfig();
    nextConfig.content['home.aboutHeading'] = 'Database managed heading';
    const savePromise = service.saveConfigOverride(nextConfig);
    const saveRequest = httpTestingController.expectOne('/api/content');
    expect(saveRequest.request.method).toBe('PUT');
    saveRequest.flush({ jsonData: saveRequest.request.body.jsonData, updatedAt: new Date().toISOString() });
    await savePromise;

    expect(service.getConfig()).toBe(sharedConfig);
    expect(sharedConfig.content['home.aboutHeading']).toBe('Database managed heading');
    expect(JSON.parse(localStorage.getItem('santa-road-site-content') ?? '{}').content['home.aboutHeading'])
      .toBe('Database managed heading');
  });

  it('should keep current content and cache unchanged when a save fails', async () => {
    const loadPromise = service.loadConfig();
    httpTestingController.expectOne('assets/config/app.config.json').flush(baseConfig);
    await Promise.resolve();
    httpTestingController.expectOne('/api/content').flush({
      jsonData: JSON.stringify(baseConfig),
      updatedAt: new Date().toISOString(),
    });
    await loadPromise;

    const cacheBeforeSave = localStorage.getItem('santa-road-site-content');
    const nextConfig = service.getEditableConfig();
    nextConfig.appName = 'Unsaved name';
    const savePromise = service.saveConfigOverride(nextConfig);
    httpTestingController.expectOne('/api/content').flush('Unavailable', { status: 503, statusText: 'Unavailable' });

    await expectAsync(savePromise).toBeRejected();
    expect(service.getConfig().appName).toBe(baseConfig.appName);
    expect(localStorage.getItem('santa-road-site-content')).toBe(cacheBeforeSave);
  });

  it('should preserve an empty content tombstone instead of restoring its default', async () => {
    const configWithDefault = {
      ...baseConfig,
      content: { 'home.optionalSection': 'Visible by default' },
    };
    const loadPromise = service.loadConfig();
    httpTestingController.expectOne('assets/config/app.config.json').flush(configWithDefault);
    await Promise.resolve();
    httpTestingController.expectOne('/api/content').flush({
      jsonData: JSON.stringify({ content: { 'home.optionalSection': '' } }),
      updatedAt: new Date().toISOString(),
    });

    await loadPromise;
    expect(service.getConfig().content['home.optionalSection']).toBe('');
  });
});
