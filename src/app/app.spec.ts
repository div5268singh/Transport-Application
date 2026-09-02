import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { TEST_APP_CONFIG_PROVIDER } from './testing/app-config.stub';
=======
import { RouterModule } from '@angular/router';
import { App } from './app';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [
        App
      ],
<<<<<<< HEAD
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER],
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

<<<<<<< HEAD
  it('should render the application shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.site-shell')).toBeTruthy();
=======
  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, santa-road');
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  });
});
