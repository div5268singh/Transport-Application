import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { MediaLoader } from '../../core/services/media-loader';

/**
 * Binds an API-hosted image or video to an element without ever putting the
 * API address in the DOM - the element receives a local blob: URL instead.
 */
@Directive({
  selector: '[appMediaSrc]',
  standalone: false,
})
export class MediaSrcDirective implements OnChanges {
  @Input('appMediaSrc') path: string | null | undefined;
  /** Set to 'background-image' to paint the element instead of setting src. */
  @Input() mediaTarget: 'src' | 'background-image' = 'src';
  /** Optional poster frame for <video>, resolved the same way as the source. */
  @Input() mediaPoster: string | null | undefined;

  private requestedPath: string | null | undefined;
  private requestedPoster: string | null | undefined;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly mediaLoader: MediaLoader,
  ) {}

  ngOnChanges(): void {
    const requested = this.path;
    this.requestedPath = requested;

    void this.mediaLoader.load(requested).then((url) => {
      // A newer binding may have landed while this download was in flight.
      if (this.requestedPath === requested) {
        this.apply(url);
      }
    });

    const requestedPoster = this.mediaPoster;
    this.requestedPoster = requestedPoster;

    if (requestedPoster) {
      void this.mediaLoader.load(requestedPoster).then((url) => {
        if (this.requestedPoster === requestedPoster && url) {
          this.renderer.setAttribute(this.elementRef.nativeElement, 'poster', url);
        }
      });
    }
  }

  private apply(url: string): void {
    const element = this.elementRef.nativeElement;

    if (this.mediaTarget === 'background-image') {
      this.renderer.setStyle(element, 'background-image', url ? `url(${url})` : 'none');
      return;
    }

    if (url) {
      this.renderer.setAttribute(element, 'src', url);
    } else {
      this.renderer.removeAttribute(element, 'src');
    }
  }
}
