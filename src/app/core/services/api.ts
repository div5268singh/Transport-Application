import { Injectable } from '@angular/core';
import { AppConfig } from './app-config';
import { StorageSimulator } from './storage-simulator';
import { BannerContent, PosterContent, VideoContent } from '../models/app-config.model';
import { LeadRequest, UploadedAsset, UploadedAssetCategory } from '../models/transport.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly storageSimulator: StorageSimulator,
  ) {}

  submitLeadRequest(leadRequest: Omit<LeadRequest, 'submittedAt'>): void {
    this.storageSimulator.saveLeadRequest({
      ...leadRequest,
      submittedAt: new Date().toISOString(),
    });
  }

  buildLeadMailtoLink(leadRequest: Omit<LeadRequest, 'submittedAt'>): string {
    const destinationEmail = this.appConfig.getConfig().contact.leadEmail ?? this.appConfig.getConfig().contact.email;
    const subject = `New Freight Lead: ${leadRequest.materialType} from ${leadRequest.origin} to ${leadRequest.destination}`;
    const body = [
      'New contact lead received from website:',
      '',
      `Name: ${leadRequest.userName}`,
      `Phone: ${leadRequest.phone}`,
      `Email: ${leadRequest.email}`,
      `Material Type: ${leadRequest.materialType}`,
      `Origin: ${leadRequest.origin}`,
      `Destination: ${leadRequest.destination}`,
      `Weight: ${leadRequest.weight}`,
    ].join('\n');

    return `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  uploadAsset(file: File, category: UploadedAssetCategory): Promise<UploadedAsset> {
    return this.storageSimulator.saveAsset(file, category);
  }

  getBannerContent(): BannerContent[] {
    return this.appConfig.getConfig().homepage.banners;
  }

  getPosterContent(): PosterContent[] {
    return this.appConfig.getConfig().homepage.posters;
  }

  getVideoContent(): VideoContent[] {
    return this.appConfig.getConfig().homepage.videos;
  }

  getUploadedAssets(): UploadedAsset[] {
    return this.storageSimulator.listAssets();
  }

  getLeadRequests(): LeadRequest[] {
    return this.storageSimulator.getLeadRequests();
  }
}
