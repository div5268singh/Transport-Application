import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { Seo } from './seo';

describe('Seo', () => {
  let service: Seo;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(Seo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
