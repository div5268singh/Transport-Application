import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

import { Api } from './api';

describe('Api', () => {
  let service: Api;

  beforeEach(() => {
<<<<<<< HEAD
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
=======
    TestBed.configureTestingModule({});
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    service = TestBed.inject(Api);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
