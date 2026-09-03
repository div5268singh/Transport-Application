import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoContent } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';

@Component({
  selector: 'app-video-player',
  standalone: false,
  templateUrl: './video-player.html',
  styleUrl: './video-player.css',
})
export class VideoPlayer {
  @Input({ required: true }) item!: VideoContent;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly appConfig: AppConfig,
  ) {}

  protected content(key: string): string {
    return this.appConfig.getConfig().content[key] ?? '';
  }

  protected get embedVideoUrl(): SafeResourceUrl | null {
    const rawVideoPath = this.item.videoPath.trim();
    const youtubeId = this.extractYouTubeVideoId(rawVideoPath);
    if (youtubeId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeId}`);
    }

    const vimeoId = this.extractVimeoVideoId(rawVideoPath);
    if (vimeoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoId}`);
    }

    return null;
  }

  private extractYouTubeVideoId(videoPath: string): string | null {
    const urlMatch = videoPath.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
    return urlMatch?.[1] ?? null;
  }

  private extractVimeoVideoId(videoPath: string): string | null {
    const urlMatch = videoPath.match(/vimeo\.com\/(\d+)/i);
    return urlMatch?.[1] ?? null;
  }
}
