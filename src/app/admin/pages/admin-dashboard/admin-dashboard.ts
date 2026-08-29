import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppConfigModel,
  BannerContent,
  ClientItem,
  FeatureItem,
  ServiceItem,
  VideoContent,
} from '../../../core/models/app-config.model';
import { LeadRequest, UploadedAsset, UploadedAssetCategory } from '../../../core/models/transport.model';
import { AdminAuth } from '../../../core/services/admin-auth';
import { Api } from '../../../core/services/api';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  protected appConfig!: AppConfigModel;
  protected uploadStatus = '';
  protected contentStatus = '';
  protected mediaType: 'image' | 'video' = 'image';
  protected mediaCategory: 'banner' | 'service' | 'client' | 'video' = 'banner';
  protected mediaTitle = '';
  protected mediaDescription = '';
  protected mediaCtaText = '';
  protected mediaPath = '';
  protected mediaPosterPath = '';
  protected imageCategory: UploadedAssetCategory = 'banner';
  protected uploadedAssets: UploadedAsset[] = [];
  protected leadRequests: LeadRequest[] = [];

  protected siteName = '';
  protected phone = '';
  protected displayEmail = '';
  protected leadEmail = '';
  protected address = '';
  protected heroHeading = '';
  protected heroSubheading = '';
  protected aboutOverview = '';
  protected seoDescription = '';
  protected seoKeywords = '';

  protected banners: BannerContent[] = [];
  protected clients: ClientItem[] = [];
  protected services: ServiceItem[] = [];
  protected features: FeatureItem[] = [];
  protected videos: VideoContent[] = [];

  protected newBannerTitle = '';
  protected newBannerSubtitle = '';
  protected newBannerImagePath = '';
  protected newBannerCtaText = '';
  protected previewBannerIndex = 0;
  protected editingBannerIndex = -1;
  protected editingBannerTitle = '';
  protected editingBannerSubtitle = '';
  protected editingBannerImagePath = '';
  protected editingBannerCtaText = '';

  protected newClientName = '';
  protected newClientLogoPath = '';
  protected editingClientIndex = -1;
  protected editingClientName = '';
  protected editingClientLogoPath = '';
  protected newServiceTitle = '';
  protected newServiceSummary = '';
  protected newServiceImagePath = '';
  protected editingServiceIndex = -1;
  protected editingServiceTitle = '';
  protected editingServiceSummary = '';
  protected editingServiceImagePath = '';
  protected newFeatureTitle = '';
  protected newFeatureSummary = '';
  protected editingFeatureIndex = -1;
  protected editingFeatureTitle = '';
  protected editingFeatureSummary = '';
  protected newVideoTitle = '';
  protected newVideoSummary = '';
  protected newVideoPath = '';
  protected newVideoPosterPath = '';
  protected editingVideoIndex = -1;
  protected editingVideoTitle = '';
  protected editingVideoSummary = '';
  protected editingVideoPath = '';
  protected editingVideoPosterPath = '';

  protected uploadTitle = '';
  protected uploadDescription = '';
  protected uploadCtaText = '';

  private mediaFile: File | null = null;
  private imageFile: File | null = null;
  private videoFile: File | null = null;

  constructor(
    private readonly api: Api,
    private readonly appConfigService: AppConfig,
    private readonly adminAuth: AdminAuth,
    private readonly router: Router,
    private readonly seo: Seo,
  ) {}

  ngOnInit(): void {
    this.refreshConfigState();
    this.seo.setRouteMeta(
      'Admin Dashboard for Logistics Media Management',
      'Upload and manage banner images, transport posters, and operations videos for industrial trucking campaigns.',
    );
    this.refreshAssets();
    this.refreshLeadRequests();
  }

  onImageFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.imageFile = inputElement.files?.item(0) ?? null;
  }

  onVideoFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.videoFile = inputElement.files?.item(0) ?? null;
  }

  onMediaTypeChange(): void {
    this.mediaCategory = this.mediaType === 'image' ? 'banner' : 'video';
    this.mediaFile = null;
    this.mediaPath = '';
    this.mediaPosterPath = '';
  }

  onMediaFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.mediaFile = inputElement.files?.item(0) ?? null;
  }

  async addMediaByTypeAndCategory(): Promise<void> {
    if (!this.mediaTitle.trim() || !this.mediaDescription.trim()) {
      this.contentStatus = 'Media title and description are required.';
      return;
    }

    if (!this.mediaFile && !this.mediaPath.trim()) {
      this.contentStatus = 'Provide media file upload or media URL/path.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    let resolvedPath = this.mediaPath.trim();

    if (this.mediaFile) {
      const uploadedCategory: UploadedAssetCategory =
        this.mediaCategory === 'banner'
          ? 'banner'
          : this.mediaCategory === 'video'
            ? 'video'
            : 'poster';
      const uploadedAsset = await this.api.uploadAsset(this.mediaFile, uploadedCategory);
      resolvedPath = uploadedAsset.dataUrl;
      this.refreshAssets();
    }

    if (this.mediaCategory === 'banner') {
      nextConfig.homepage.banners.unshift({
        title: this.mediaTitle.trim(),
        subtitle: this.mediaDescription.trim(),
        imagePath: resolvedPath,
        ctaText: this.mediaCtaText.trim() || 'Read More',
      });
      this.previewBannerIndex = 0;
      this.persist(nextConfig, 'Banner media added successfully.');
    } else if (this.mediaCategory === 'service') {
      nextConfig.business.services.unshift({
        title: this.mediaTitle.trim(),
        summary: this.mediaDescription.trim(),
        imagePath: resolvedPath,
      });
      this.persist(nextConfig, 'Service media added successfully.');
    } else if (this.mediaCategory === 'client') {
      nextConfig.business.clients.unshift({
        name: this.mediaTitle.trim(),
        logoPath: resolvedPath,
      });
      this.persist(nextConfig, 'Client logo added successfully.');
    } else {
      nextConfig.homepage.videos.unshift({
        title: this.mediaTitle.trim(),
        summary: this.mediaDescription.trim(),
        videoPath: resolvedPath,
        posterPath: this.mediaPosterPath.trim() || undefined,
      });
      this.persist(nextConfig, 'Video media added successfully.');
    }

    this.mediaTitle = '';
    this.mediaDescription = '';
    this.mediaCtaText = '';
    this.mediaPath = '';
    this.mediaPosterPath = '';
    this.mediaFile = null;
  }

  async uploadImageAsset(): Promise<void> {
    if (!this.imageFile) {
      this.uploadStatus = 'Please choose an image file before upload.';
      return;
    }

    const uploadedAsset = await this.api.uploadAsset(this.imageFile, this.imageCategory);
    const nextConfig = this.appConfigService.getEditableConfig();

    if (this.imageCategory === 'banner') {
      nextConfig.homepage.banners.unshift({
        title: this.uploadTitle.trim() || this.heroHeading || 'Transportation Service Providers',
        subtitle: this.uploadDescription.trim() || this.heroSubheading || 'No.1 Place for Your Transportation Services',
        imagePath: uploadedAsset.dataUrl,
        ctaText: this.uploadCtaText.trim() || 'Read More',
      });
      this.persist(nextConfig, 'Banner uploaded with content successfully.');
      this.previewBannerIndex = 0;
    } else {
      nextConfig.business.services.unshift({
        title: this.uploadTitle.trim() || 'Industrial Transport Service',
        summary: this.uploadDescription.trim() || 'Reliable heavy trucking service.',
        imagePath: uploadedAsset.dataUrl,
      });
      this.persist(nextConfig, 'Service photo uploaded with description successfully.');
    }

    this.uploadTitle = '';
    this.uploadDescription = '';
    this.uploadCtaText = '';
    this.imageFile = null;
    this.refreshAssets();
  }

  async uploadVideoAsset(): Promise<void> {
    if (!this.videoFile) {
      this.uploadStatus = 'Please choose a video file before upload.';
      return;
    }
    if (!this.newVideoTitle.trim() || !this.newVideoSummary.trim()) {
      this.uploadStatus = 'Video title and description are required before uploading a file.';
      return;
    }

    const uploadedAsset = await this.api.uploadAsset(this.videoFile, 'video');
    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.videos.unshift({
      title: this.newVideoTitle.trim(),
      summary: this.newVideoSummary.trim(),
      videoPath: uploadedAsset.dataUrl,
      posterPath: this.newVideoPosterPath.trim() || undefined,
    });
    this.persist(nextConfig, 'Video uploaded and added successfully.');

    this.newVideoTitle = '';
    this.newVideoSummary = '';
    this.newVideoPath = '';
    this.newVideoPosterPath = '';
    this.videoFile = null;
    this.refreshAssets();
  }

  saveSiteBasics(): void {
    if (
      !this.siteName.trim() ||
      !this.phone.trim() ||
      !this.displayEmail.trim() ||
      !this.leadEmail.trim() ||
      !this.address.trim()
    ) {
      this.contentStatus = 'App name, phone, display email, lead email, and address are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.appName = this.siteName.trim();
    nextConfig.contact.phone = this.phone.trim();
    nextConfig.contact.email = this.displayEmail.trim();
    nextConfig.contact.leadEmail = this.leadEmail.trim();
    nextConfig.contact.address = this.address.trim();
    this.persist(nextConfig, 'Company details and both emails updated successfully.');
  }

  saveHomepageContent(): void {
    if (!this.heroHeading.trim() || !this.heroSubheading.trim()) {
      this.contentStatus = 'Hero heading and hero subheading are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.heroHeading = this.heroHeading.trim();
    nextConfig.homepage.heroSubheading = this.heroSubheading.trim();
    this.persist(nextConfig, 'Homepage content updated successfully.');
  }

  addBanner(): void {
    if (
      !this.newBannerTitle.trim() ||
      !this.newBannerSubtitle.trim() ||
      !this.newBannerImagePath.trim() ||
      !this.newBannerCtaText.trim()
    ) {
      this.contentStatus = 'Banner title, subtitle, image path, and CTA text are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.banners.unshift({
      title: this.newBannerTitle.trim(),
      subtitle: this.newBannerSubtitle.trim(),
      imagePath: this.newBannerImagePath.trim(),
      ctaText: this.newBannerCtaText.trim(),
    });
    this.newBannerTitle = '';
    this.newBannerSubtitle = '';
    this.newBannerImagePath = '';
    this.newBannerCtaText = '';
    this.persist(nextConfig, 'Banner added successfully.');
    this.previewBannerIndex = 0;
  }

  removeBanner(index: number): void {
    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.banners.splice(index, 1);
    if (this.editingBannerIndex === index) {
      this.cancelBannerEdit();
    }
    this.persist(nextConfig, 'Banner removed successfully.');
    this.previewBannerIndex = 0;
  }

  setPreviewBanner(index: number): void {
    this.previewBannerIndex = index;
  }

  startBannerEdit(index: number): void {
    const banner = this.banners[index];
    if (!banner) {
      this.contentStatus = 'Selected banner not found.';
      return;
    }

    this.editingBannerIndex = index;
    this.editingBannerTitle = banner.title;
    this.editingBannerSubtitle = banner.subtitle;
    this.editingBannerImagePath = banner.imagePath;
    this.editingBannerCtaText = banner.ctaText;
  }

  saveBannerEdit(): void {
    if (this.editingBannerIndex < 0) {
      this.contentStatus = 'No banner selected for editing.';
      return;
    }
    if (
      !this.editingBannerTitle.trim() ||
      !this.editingBannerSubtitle.trim() ||
      !this.editingBannerImagePath.trim() ||
      !this.editingBannerCtaText.trim()
    ) {
      this.contentStatus = 'Banner title, subtitle, image path, and CTA text are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.banners[this.editingBannerIndex] = {
      title: this.editingBannerTitle.trim(),
      subtitle: this.editingBannerSubtitle.trim(),
      imagePath: this.editingBannerImagePath.trim(),
      ctaText: this.editingBannerCtaText.trim(),
    };
    this.persist(nextConfig, 'Banner updated successfully.');
    this.cancelBannerEdit();
  }

  cancelBannerEdit(): void {
    this.editingBannerIndex = -1;
    this.editingBannerTitle = '';
    this.editingBannerSubtitle = '';
    this.editingBannerImagePath = '';
    this.editingBannerCtaText = '';
  }

  saveAboutContent(): void {
    if (!this.aboutOverview.trim()) {
      this.contentStatus = 'About overview is required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.about.overview = this.aboutOverview.trim();
    this.persist(nextConfig, 'About section updated successfully.');
  }

  saveSeoContent(): void {
    const keywords = this.seoKeywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    if (!this.seoDescription.trim() || keywords.length < 5) {
      this.contentStatus = 'SEO description and at least 5 keywords are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.seo.defaultDescription = this.seoDescription.trim();
    nextConfig.seo.keywords = keywords;
    this.persist(nextConfig, 'SEO content updated successfully.');
  }

  addClient(): void {
    if (!this.newClientName.trim() || !this.newClientLogoPath.trim()) {
      this.contentStatus = 'Client name and logo path are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.clients.unshift({
      name: this.newClientName.trim(),
      logoPath: this.newClientLogoPath.trim(),
    });
    this.newClientName = '';
    this.newClientLogoPath = '';
    this.persist(nextConfig, 'Client added successfully.');
  }

  removeClient(index: number): void {
    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.clients.splice(index, 1);
    if (this.editingClientIndex === index) {
      this.cancelClientEdit();
    }
    this.persist(nextConfig, 'Client removed successfully.');
  }

  startClientEdit(index: number): void {
    const client = this.clients[index];
    if (!client) {
      this.contentStatus = 'Selected client not found.';
      return;
    }

    this.editingClientIndex = index;
    this.editingClientName = client.name;
    this.editingClientLogoPath = client.logoPath;
  }

  saveClientEdit(): void {
    if (this.editingClientIndex < 0) {
      this.contentStatus = 'No client selected for editing.';
      return;
    }
    if (!this.editingClientName.trim() || !this.editingClientLogoPath.trim()) {
      this.contentStatus = 'Client name and logo path are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.clients[this.editingClientIndex] = {
      name: this.editingClientName.trim(),
      logoPath: this.editingClientLogoPath.trim(),
    };
    this.persist(nextConfig, 'Client updated successfully.');
    this.cancelClientEdit();
  }

  cancelClientEdit(): void {
    this.editingClientIndex = -1;
    this.editingClientName = '';
    this.editingClientLogoPath = '';
  }

  addService(): void {
    if (!this.newServiceTitle.trim() || !this.newServiceSummary.trim() || !this.newServiceImagePath.trim()) {
      this.contentStatus = 'Service title, summary, and image path are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.services.unshift({
      title: this.newServiceTitle.trim(),
      summary: this.newServiceSummary.trim(),
      imagePath: this.newServiceImagePath.trim(),
    });
    this.newServiceTitle = '';
    this.newServiceSummary = '';
    this.newServiceImagePath = '';
    this.persist(nextConfig, 'Service added successfully.');
  }

  removeService(index: number): void {
    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.services.splice(index, 1);
    if (this.editingServiceIndex === index) {
      this.cancelServiceEdit();
    }
    this.persist(nextConfig, 'Service removed successfully.');
  }

  startServiceEdit(index: number): void {
    const service = this.services[index];
    if (!service) {
      this.contentStatus = 'Selected service not found.';
      return;
    }

    this.editingServiceIndex = index;
    this.editingServiceTitle = service.title;
    this.editingServiceSummary = service.summary;
    this.editingServiceImagePath = service.imagePath;
  }

  saveServiceEdit(): void {
    if (this.editingServiceIndex < 0) {
      this.contentStatus = 'No service selected for editing.';
      return;
    }
    if (!this.editingServiceTitle.trim() || !this.editingServiceSummary.trim() || !this.editingServiceImagePath.trim()) {
      this.contentStatus = 'Service title, summary, and image path are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.services[this.editingServiceIndex] = {
      title: this.editingServiceTitle.trim(),
      summary: this.editingServiceSummary.trim(),
      imagePath: this.editingServiceImagePath.trim(),
    };
    this.persist(nextConfig, 'Service updated successfully.');
    this.cancelServiceEdit();
  }

  cancelServiceEdit(): void {
    this.editingServiceIndex = -1;
    this.editingServiceTitle = '';
    this.editingServiceSummary = '';
    this.editingServiceImagePath = '';
  }

  addFeature(): void {
    if (!this.newFeatureTitle.trim() || !this.newFeatureSummary.trim()) {
      this.contentStatus = 'Feature title and summary are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.features.unshift({
      title: this.newFeatureTitle.trim(),
      summary: this.newFeatureSummary.trim(),
    });
    this.newFeatureTitle = '';
    this.newFeatureSummary = '';
    this.persist(nextConfig, 'Feature added successfully.');
  }

  removeFeature(index: number): void {
    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.features.splice(index, 1);
    if (this.editingFeatureIndex === index) {
      this.cancelFeatureEdit();
    }
    this.persist(nextConfig, 'Feature removed successfully.');
  }

  startFeatureEdit(index: number): void {
    const feature = this.features[index];
    if (!feature) {
      this.contentStatus = 'Selected feature not found.';
      return;
    }

    this.editingFeatureIndex = index;
    this.editingFeatureTitle = feature.title;
    this.editingFeatureSummary = feature.summary;
  }

  saveFeatureEdit(): void {
    if (this.editingFeatureIndex < 0) {
      this.contentStatus = 'No feature selected for editing.';
      return;
    }
    if (!this.editingFeatureTitle.trim() || !this.editingFeatureSummary.trim()) {
      this.contentStatus = 'Feature title and summary are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.business.features[this.editingFeatureIndex] = {
      title: this.editingFeatureTitle.trim(),
      summary: this.editingFeatureSummary.trim(),
    };
    this.persist(nextConfig, 'Feature updated successfully.');
    this.cancelFeatureEdit();
  }

  cancelFeatureEdit(): void {
    this.editingFeatureIndex = -1;
    this.editingFeatureTitle = '';
    this.editingFeatureSummary = '';
  }

  addVideo(): void {
    if (!this.newVideoTitle.trim() || !this.newVideoSummary.trim() || !this.newVideoPath.trim()) {
      this.contentStatus = 'Video title, description, and video URL/path are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.videos.unshift({
      title: this.newVideoTitle.trim(),
      summary: this.newVideoSummary.trim(),
      videoPath: this.newVideoPath.trim(),
      posterPath: this.newVideoPosterPath.trim() || undefined,
    });
    this.newVideoTitle = '';
    this.newVideoSummary = '';
    this.newVideoPath = '';
    this.newVideoPosterPath = '';
    this.persist(nextConfig, 'Video content added successfully.');
  }

  removeVideo(index: number): void {
    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.videos.splice(index, 1);
    if (this.editingVideoIndex === index) {
      this.cancelVideoEdit();
    }
    this.persist(nextConfig, 'Video content removed successfully.');
  }

  startVideoEdit(index: number): void {
    const video = this.videos[index];
    if (!video) {
      this.contentStatus = 'Selected video not found.';
      return;
    }

    this.editingVideoIndex = index;
    this.editingVideoTitle = video.title;
    this.editingVideoSummary = video.summary;
    this.editingVideoPath = video.videoPath;
    this.editingVideoPosterPath = video.posterPath ?? '';
  }

  saveVideoEdit(): void {
    if (this.editingVideoIndex < 0) {
      this.contentStatus = 'No video selected for editing.';
      return;
    }
    if (!this.editingVideoTitle.trim() || !this.editingVideoSummary.trim() || !this.editingVideoPath.trim()) {
      this.contentStatus = 'Video title, description, and video URL/path are required.';
      return;
    }

    const nextConfig = this.appConfigService.getEditableConfig();
    nextConfig.homepage.videos[this.editingVideoIndex] = {
      title: this.editingVideoTitle.trim(),
      summary: this.editingVideoSummary.trim(),
      videoPath: this.editingVideoPath.trim(),
      posterPath: this.editingVideoPosterPath.trim() || undefined,
    };

    this.persist(nextConfig, 'Video content updated successfully.');
    this.cancelVideoEdit();
  }

  cancelVideoEdit(): void {
    this.editingVideoIndex = -1;
    this.editingVideoTitle = '';
    this.editingVideoSummary = '';
    this.editingVideoPath = '';
    this.editingVideoPosterPath = '';
  }

  resetContentToDefault(): void {
    this.appConfigService.clearConfigOverride();
    this.refreshConfigState();
    this.previewBannerIndex = 0;
    this.contentStatus = 'Content reset to default configuration.';
  }

  async logout(): Promise<void> {
    try {
      await this.adminAuth.logout();
      await this.router.navigate(['/admin/login']);
    } catch {
      this.contentStatus =
        'Unable to sign out right now because the admin authentication service is unavailable.';
    }
  }

  copyAdminUrl(): void {
    navigator.clipboard
      .writeText(`${window.location.origin}/admin/login`)
      .then(() => {
        this.contentStatus = 'Admin URL copied: /admin/login';
      })
      .catch(() => {
        this.contentStatus = 'Unable to copy URL automatically. Use /admin/login manually.';
      });
  }

  protected get previewBanner(): BannerContent | null {
    return this.banners[this.previewBannerIndex] ?? null;
  }

  private persist(nextConfig: AppConfigModel, successMessage: string): void {
    this.appConfigService.saveConfigOverride(nextConfig);
    this.refreshConfigState();
    this.contentStatus = successMessage;
  }

  private refreshAssets(): void {
    this.uploadedAssets = this.api.getUploadedAssets();
  }

  private refreshLeadRequests(): void {
    this.leadRequests = this.api.getLeadRequests();
  }

  private refreshConfigState(): void {
    this.appConfig = this.appConfigService.getConfig();
    this.siteName = this.appConfig.appName;
    this.phone = this.appConfig.contact.phone;
    this.displayEmail = this.appConfig.contact.email;
    this.leadEmail = this.appConfig.contact.leadEmail ?? this.appConfig.contact.email;
    this.address = this.appConfig.contact.address;
    this.heroHeading = this.appConfig.homepage.heroHeading;
    this.heroSubheading = this.appConfig.homepage.heroSubheading;
    this.aboutOverview = this.appConfig.about.overview;
    this.seoDescription = this.appConfig.seo.defaultDescription;
    this.seoKeywords = this.appConfig.seo.keywords.join(', ');
    this.banners = [...this.appConfig.homepage.banners];
    this.clients = [...this.appConfig.business.clients];
    this.services = [...this.appConfig.business.services];
    this.features = [...this.appConfig.business.features];
    this.videos = [...this.appConfig.homepage.videos];
    this.refreshLeadRequests();
  }
}
