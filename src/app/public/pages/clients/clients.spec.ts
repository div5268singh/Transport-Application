import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { Clients } from './clients';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';

describe('Clients', () => {
  let component: Clients;
  let fixture: ComponentFixture<Clients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Clients],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
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
