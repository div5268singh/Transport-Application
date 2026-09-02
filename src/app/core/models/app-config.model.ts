export interface ContactDetails {
  phone: string;
  email: string;
  leadEmail?: string;
  address: string;
}

export interface BrandConfig {
  logoPath: string;
}

export interface BannerContent {
  title: string;
  subtitle: string;
  imagePath: string;
  ctaText: string;
}

export interface PosterContent {
  title: string;
  summary: string;
  imagePath: string;
}

export interface VideoContent {
  title: string;
  summary: string;
  videoPath: string;
  posterPath?: string;
}

export interface HomePageConfig {
  heroHeading: string;
  heroSubheading: string;
  banners: BannerContent[];
  posters: PosterContent[];
  videos: VideoContent[];
}

export interface AboutPageConfig {
  overview: string;
  operationalFootprint: string[];
}

export interface ServiceItem {
  title: string;
  summary: string;
  imagePath: string;
}

export interface FeatureItem {
  title: string;
  summary: string;
}

export interface ClientItem {
  name: string;
  logoPath: string;
}

export interface BusinessConfig {
  services: ServiceItem[];
  features: FeatureItem[];
  clients: ClientItem[];
}

export interface SeoConfig {
  defaultDescription: string;
  keywords: string[];
}

export interface AdminConfig {
  authApiBaseUrl?: string;
}

export interface AppConfigModel {
  appName: string;
  brand: BrandConfig;
  contact: ContactDetails;
<<<<<<< HEAD
  content: Record<string, string>;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  seo: SeoConfig;
  homepage: HomePageConfig;
  about: AboutPageConfig;
  business: BusinessConfig;
  admin: AdminConfig;
}
