import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactUs } from './contact-us';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';
=======

import { ContactUs } from './contact-us';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

describe('ContactUs', () => {
  let component: ContactUs;
  let fixture: ComponentFixture<ContactUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD
      imports: [ReactiveFormsModule],
      declarations: [ContactUs],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
=======
      declarations: [ContactUs]
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
