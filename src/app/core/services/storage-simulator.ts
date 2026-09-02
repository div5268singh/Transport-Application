import { Injectable } from '@angular/core';
import { LeadRequest, UploadedAsset, UploadedAssetCategory } from '../models/transport.model';

@Injectable({
  providedIn: 'root',
})
export class StorageSimulator {
  private readonly assetsStorageKey = 'santa-road-uploaded-assets';
  private readonly leadsStorageKey = 'santa-road-lead-requests';

  async saveAsset(file: File, category: UploadedAssetCategory): Promise<UploadedAsset> {
    const dataUrl = await this.readFileAsDataUrl(file);
    const createdAt = new Date().toISOString();
    const folder = category === 'video' ? 'videos' : category === 'poster' ? 'posters' : 'banners';
    const sanitizedName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    const simulatedPath = `/assets/uploads/${folder}/${sanitizedName}`;

    const asset: UploadedAsset = {
      id: crypto.randomUUID(),
      fileName: file.name,
      category,
      mimeType: file.type,
      dataUrl,
      simulatedPath,
      uploadedAt: createdAt,
    };

    const assets = this.getStoredAssets();
    this.setStoredAssets([asset, ...assets]);

    return asset;
  }

  listAssets(category?: UploadedAssetCategory): UploadedAsset[] {
    const assets = this.getStoredAssets();
    return category ? assets.filter((asset) => asset.category === category) : assets;
  }

  saveLeadRequest(leadRequest: LeadRequest): void {
    const existingRequests = this.getLeadRequests();
    this.setLeadRequests([leadRequest, ...existingRequests]);
  }

  getLeadRequests(): LeadRequest[] {
    return this.getItem<LeadRequest[]>(this.leadsStorageKey, []);
  }

  private getStoredAssets(): UploadedAsset[] {
    return this.getItem<UploadedAsset[]>(this.assetsStorageKey, []);
  }

  private setStoredAssets(assets: UploadedAsset[]): void {
    this.setItem(this.assetsStorageKey, assets);
  }

  private setLeadRequests(leads: LeadRequest[]): void {
    this.setItem(this.leadsStorageKey, leads);
  }

  private getItem<T>(key: string, fallbackValue: T): T {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallbackValue;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  }
}
