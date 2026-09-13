import { Component, Input } from '@angular/core';
import { BannerContent } from '../../../core/models/app-config.model';

@Component({
  selector: 'app-banner',
  standalone: false,
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  @Input({ required: true }) item!: BannerContent;
}
