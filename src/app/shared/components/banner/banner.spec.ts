import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Banner } from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Banner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
<<<<<<< HEAD
    component.item = { title: 'Test', subtitle: 'Test', imagePath: '/test.jpg', ctaText: 'Test' };
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
