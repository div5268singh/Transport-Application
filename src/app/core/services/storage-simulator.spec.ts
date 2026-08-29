import { TestBed } from '@angular/core/testing';

import { StorageSimulator } from './storage-simulator';

describe('StorageSimulator', () => {
  let service: StorageSimulator;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageSimulator);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save poster assets under posters folder', async () => {
    const file = new File(['poster-content'], 'Poster Hero.png', { type: 'image/png' });

    const asset = await service.saveAsset(file, 'poster');

    expect(asset.simulatedPath).toContain('/assets/uploads/posters/');
  });
});
