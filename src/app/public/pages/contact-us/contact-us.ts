import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
<<<<<<< HEAD
import { AppConfigModel, ContactDetails } from '../../../core/models/app-config.model';
=======
import { ContactDetails } from '../../../core/models/app-config.model';
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
import { Api } from '../../../core/services/api';
import { AppConfig } from '../../../core/services/app-config';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-contact-us',
  standalone: false,
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements OnInit {
<<<<<<< HEAD
  protected readonly config: AppConfigModel;
=======
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  protected submissionStatus = '';
  protected readonly contactDetails: ContactDetails;
  protected readonly leadEmail: string;
  private readonly formBuilder = inject(FormBuilder);

  protected readonly leadForm = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,16}$/)]],
    email: ['', [Validators.required, Validators.email]],
    materialType: ['', [Validators.required]],
    origin: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    weight: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?\s?(kg|ton|tons|tonnes)?$/i)]],
  });

  constructor(
    private readonly api: Api,
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
<<<<<<< HEAD
    this.config = appConfig.getConfig();
    this.contactDetails = this.config.contact;
    this.leadEmail = this.config.contact.leadEmail ?? this.config.contact.email;
=======
    this.contactDetails = appConfig.getConfig().contact;
    this.leadEmail = appConfig.getConfig().contact.leadEmail ?? appConfig.getConfig().contact.email;
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
<<<<<<< HEAD
      this.content('contact.seoTitle'),
      this.content('contact.seoDescription'),
=======
      'Contact Us for Steel and Iron Freight Quotes',
      'Submit your city-to-city heavy freight enquiry for raw materials including steel coils, billets, iron sheets, and factory supply loads.',
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
    );
  }

  onSubmit(): void {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    const leadRequest = this.leadForm.getRawValue();
    this.api.submitLeadRequest(leadRequest);
    const mailtoLink = this.api.buildLeadMailtoLink(leadRequest);
    this.leadForm.reset();
    window.location.href = mailtoLink;
<<<<<<< HEAD
    this.submissionStatus = this.content('contact.successMessage').replace('{email}', this.leadEmail);
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
=======
    this.submissionStatus =
      `Thank you. Your email draft has been opened for ${this.leadEmail}. Please send it to submit this lead.`;
>>>>>>> e4b4c23502783af1c220ace4be71d05d63e14c8e
  }
}
