import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactDetails } from '../../../core/models/app-config.model';
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
    this.contactDetails = appConfig.getConfig().contact;
    this.leadEmail = appConfig.getConfig().contact.leadEmail ?? appConfig.getConfig().contact.email;
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      'Contact Us for Steel and Iron Freight Quotes',
      'Submit your city-to-city heavy freight enquiry for raw materials including steel coils, billets, iron sheets, and factory supply loads.',
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
    this.submissionStatus =
      `Thank you. Your email draft has been opened for ${this.leadEmail}. Please send it to submit this lead.`;
  }
}
