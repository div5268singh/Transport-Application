import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root',
})
export class Seo {
  private readonly mandatoryKeywords = [
    'heavy industrial trucking',
    'steel transport logistics',
    'bulk iron freight services',
    'factory raw material transport',
    'intercity flatbed truck booking',
    'industrial trailer transport India',
    'B2B heavy cargo logistics',
    'over dimension cargo transport',
    'manufacturing raw material movement',
    'city to city freight trucking',
  ];

  constructor(
    private readonly titleService: Title,
    private readonly meta: Meta,
    private readonly appConfig: AppConfig,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  setRouteMeta(pageTitle: string, description: string): void {
    const config = this.appConfig.getConfig();
    const title = `${pageTitle} | ${config.appName}`;
    const keywords = [...config.seo.keywords, ...this.mandatoryKeywords].join(', ');
    const canonicalUrl = `${this.document.location.origin}${this.document.location.pathname}`;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name', content: config.appName });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    this.updateCanonical(canonicalUrl);
    this.updateStructuredData(title, description, canonicalUrl);
  }

  private updateCanonical(canonicalUrl: string): void {
    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonicalUrl);
      return;
    }

    const canonicalLink = this.document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonicalUrl);
    this.document.head.appendChild(canonicalLink);
  }

  private updateStructuredData(title: string, description: string, canonicalUrl: string): void {
    const config = this.appConfig.getConfig();
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: config.appName,
      description,
      url: canonicalUrl,
      telephone: config.contact.phone,
      email: config.contact.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.contact.address,
        addressCountry: 'IN',
      },
      areaServed: ['India'],
      serviceType: config.business.services.map((service) => service.title),
      keywords: [...config.seo.keywords, ...this.mandatoryKeywords].join(', '),
    };

    const scriptId = 'santa-road-seo-schema';
    const existingScript = this.document.getElementById(scriptId);
    const schemaScript = existingScript ?? this.document.createElement('script');
    schemaScript.setAttribute('id', scriptId);
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify(payload);

    if (!existingScript) {
      this.document.head.appendChild(schemaScript);
    }

    this.meta.updateTag({ name: 'application-name', content: title });
  }
}
