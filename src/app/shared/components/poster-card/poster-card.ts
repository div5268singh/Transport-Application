import { Component, Input } from '@angular/core';
import { PosterContent } from '../../../core/models/app-config.model';

@Component({
  selector: 'app-poster-card',
  standalone: false,
  templateUrl: './poster-card.html',
  styleUrl: './poster-card.css',
})
export class PosterCard {
  @Input({ required: true }) item!: PosterContent;
}
