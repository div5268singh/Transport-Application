import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ConsignmentService,
  ConsignmentStatus,
  PublicTracking,
} from '../../../core/services/consignment';
import { Seo } from '../../../core/services/seo';
import { AppConfigModel } from '../../../core/models/app-config.model';
import { AppConfig } from '../../../core/services/app-config';

@Component({
  selector: 'app-shipment-tracking',
  standalone: false,
  templateUrl: './shipment-tracking.html',
  styleUrl: './shipment-tracking.css',
})
export class ShipmentTracking implements OnInit {
  protected readonly config: AppConfigModel;
  protected readonly consignmentNumber = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly statuses: ConsignmentStatus[] = [
    'Created',
    'PickedUp',
    'InTransit',
    'Delivered',
  ];
  protected shipment: PublicTracking | null = null;
  protected isLoading = false;
  protected errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly consignmentService: ConsignmentService,
    appConfig: AppConfig,
    private readonly seo: Seo,
  ) {
    this.config = appConfig.getConfig();
  }

  ngOnInit(): void {
    this.seo.setRouteMeta(
      this.content('tracking.seoTitle'),
      this.content('tracking.seoDescription'),
    );

    this.route.paramMap.subscribe((params) => {
      const routeNumber = params.get('consignmentNumber')?.trim();
      if (routeNumber) {
        this.consignmentNumber.setValue(routeNumber);
        this.loadShipment(routeNumber);
      }
    });
  }

  protected trackShipment(): void {
    const number = this.consignmentNumber.value.trim().toUpperCase();
    if (!number) {
      this.consignmentNumber.markAsTouched();
      return;
    }

    if (this.route.snapshot.paramMap.get('consignmentNumber') === number) {
      this.loadShipment(number);
      return;
    }

    void this.router.navigate(['/track', number]);
  }

  protected isStatusComplete(status: ConsignmentStatus): boolean {
    if (!this.shipment) {
      return false;
    }

    return this.statuses.indexOf(status) <= this.statuses.indexOf(this.shipment.status);
  }

  protected statusLabel(status: ConsignmentStatus): string {
    return this.content(`tracking.status.${status}`);
  }

  protected content(key: string): string {
    return this.config.content[key] ?? '';
  }

  private loadShipment(number: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.shipment = null;

    this.consignmentService.track(number).subscribe({
      next: (shipment) => {
        this.shipment = shipment;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.status === 404
            ? this.content('tracking.notFoundMessage')
            : this.content('tracking.unavailableMessage');
        this.isLoading = false;
      },
    });
  }
}