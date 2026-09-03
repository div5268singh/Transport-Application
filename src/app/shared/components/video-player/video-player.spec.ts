import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { VideoPlayer } from './video-player';
import { TEST_APP_CONFIG_PROVIDER } from '../../../testing/app-config.stub';

describe('VideoPlayer', () => {
  let component: VideoPlayer;
  let fixture: ComponentFixture<VideoPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoPlayer],
      providers: [provideHttpClient(), TEST_APP_CONFIG_PROVIDER]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayer);
    component = fixture.componentInstance;
    component.item = { title: 'Test', summary: 'Test', videoPath: '/test.mp4' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
