import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';

import { Clients } from './clients';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';
=======

import { Clients } from './clients';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

describe('Clients', () => {
  let component: Clients;
  let fixture: ComponentFixture<Clients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      declarations: [Clients],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
=======
      declarations: [Clients]
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
