export type UploadedAssetCategory = 'banner' | 'poster' | 'video';

export interface LeadRequest {
  readonly userName: string;
  readonly phone: string;
  readonly email: string;
  readonly materialType: string;
  readonly origin: string;
  readonly destination: string;
  readonly weight: string;
  readonly submittedAt: string;
}

export interface UploadedAsset {
  readonly id: string;
  readonly fileName: string;
  readonly category: UploadedAssetCategory;
  readonly mimeType: string;
  readonly dataUrl: string;
  readonly simulatedPath: string;
  readonly uploadedAt: string;
}
