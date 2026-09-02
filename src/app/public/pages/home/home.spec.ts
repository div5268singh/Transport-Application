import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';

import { Home } from './home';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';
=======

import { Home } from './home';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      declarations: [Home],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
=======
      declarations: [Home]
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
