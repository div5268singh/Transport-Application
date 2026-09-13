import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Banner } from './components/banner/banner';
import { PosterCard } from './components/poster-card/poster-card';
import { VideoPlayer } from './components/video-player/video-player';
import { MediaSrcDirective } from './directives/media-src.directive';

@NgModule({
  declarations: [
    Banner,
    PosterCard,
    VideoPlayer,
    MediaSrcDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Banner,
    PosterCard,
    VideoPlayer,
    MediaSrcDirective,
  ],
})
export class SharedModule { }
