import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';

import { PosterCard } from './poster-card';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';
=======

import { PosterCard } from './poster-card';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

describe('PosterCard', () => {
  let component: PosterCard;
  let fixture: ComponentFixture<PosterCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      declarations: [PosterCard],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
=======
      declarations: [PosterCard]
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterCard);
    component = fixture.componentInstance;
<<<<<<< HEAD
    component.item = { title: 'Test', summary: 'Test', imagePath: '/test.jpg' };
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
