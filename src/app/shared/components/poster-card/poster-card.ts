import { Component, Input } from '@angular/core';
import { PosterContent } from '../../../core/models/app-config.model';
<<<<<<< HEAD
import { AppConfig } from '../../../core/services/app-config';
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

@Component({
  selector: 'app-poster-card',
  standalone: false,
  templateUrl: './poster-card.html',
  styleUrl: './poster-card.css',
})
export class PosterCard {
  @Input({ required: true }) item!: PosterContent;
<<<<<<< HEAD

  constructor(private readonly appConfig: AppConfig) {}

  protected content(key: string): string {
    return this.appConfig.getConfig().content[key] ?? '';
  }
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
}
