import { Injectable } from '@angular/core';
import { AppConfig } from './app-config';
import { StorageSimulator } from './storage-simulator';
<<<<<<< HEAD
import { firstValueFrom } from 'rxjs';
import { BannerContent, PosterContent, VideoContent } from '../models/app-config.model';
import { LeadRequest, UploadedAsset, UploadedAssetCategory } from '../models/transport.model';
import { ContentService } from './content';
=======
import { BannerContent, PosterContent, VideoContent } from '../models/app-config.model';
import { LeadRequest, UploadedAsset, UploadedAssetCategory } from '../models/transport.model';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e

@Injectable({
  providedIn: 'root',
})
export class Api {
<<<<<<< HEAD
  private uploadedAssets: UploadedAsset[] = [];

  constructor(
    private readonly appConfig: AppConfig,
    private readonly storageSimulator: StorageSimulator,
    private readonly contentService: ContentService,
=======
  constructor(
    private readonly appConfig: AppConfig,
    private readonly storageSimulator: StorageSimulator,
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
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

<<<<<<< HEAD
  async uploadAsset(file: File, category: UploadedAssetCategory): Promise<UploadedAsset> {
    const response = await firstValueFrom(this.contentService.uploadMedia(file));
    const uploadedAsset: UploadedAsset = {
      id: crypto.randomUUID(),
      fileName: response.fileName || file.name,
      category,
      mimeType: file.type,
      dataUrl: response.url,
      simulatedPath: response.url,
      uploadedAt: new Date().toISOString(),
    };
    this.uploadedAssets = [uploadedAsset, ...this.uploadedAssets];
    return uploadedAsset;
=======
  uploadAsset(file: File, category: UploadedAssetCategory): Promise<UploadedAsset> {
    return this.storageSimulator.saveAsset(file, category);
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
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
<<<<<<< HEAD
    return this.uploadedAssets;
=======
    return this.storageSimulator.listAssets();
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  }

  getLeadRequests(): LeadRequest[] {
    return this.storageSimulator.getLeadRequests();
  }
}
