import { Provider } from '@angular/core';
import { AppConfigModel } from '../core/models/app-config.model';
import { AppConfig } from '../core/services/app-config';

const createTestConfig = (): AppConfigModel => ({
  appName: 'New Satna Road Lines',
  brand: { logoPath: '/assets/brand/logo.svg' },
  contact: {
    phone: '0000000000',
    email: 'test@example.com',
    leadEmail: 'leads@example.com',
    address: 'Test address',
  },
  content: {},
  seo: { defaultDescription: 'Test description', keywords: [] },
  homepage: {
    heroHeading: 'Test heading',
    heroSubheading: 'Test subheading',
    banners: [],
    posters: [],
    videos: [],
  },
  about: { overview: 'Test overview', operationalFootprint: [] },
  business: { services: [], features: [], clients: [] },
  admin: {},
});

export const TEST_APP_CONFIG_PROVIDER: Provider = {
  provide: AppConfig,
  useFactory: () => ({ getConfig: createTestConfig }),
};