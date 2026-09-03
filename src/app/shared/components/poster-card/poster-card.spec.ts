import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PosterCard } from './poster-card';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';

describe('PosterCard', () => {
  let component: PosterCard;
  let fixture: ComponentFixture<PosterCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosterCard],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterCard);
    component = fixture.componentInstance;
    component.item = { title: 'Test', summary: 'Test', imagePath: '/test.jpg' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
