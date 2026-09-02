import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';

import { AboutUs } from './about-us';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';
=======

import { AboutUs } from './about-us';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

describe('AboutUs', () => {
  let component: AboutUs;
  let fixture: ComponentFixture<AboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      declarations: [AboutUs],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
=======
      declarations: [AboutUs]
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
