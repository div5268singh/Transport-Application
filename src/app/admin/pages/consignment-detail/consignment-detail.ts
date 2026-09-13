import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ConsignmentDetail as ConsignmentDetailDto, ConsignmentService, ConsignmentStatus, CreateConsignmentRequest } from '../../../core/services/consignment';

@Component({
  selector: 'app-consignment-detail',
  standalone: false,
  templateUrl: './consignment-detail.html',
})
export class ConsignmentDetail implements OnInit {
  private static readonly phonePattern = /^[0-9+\-()\s]{7,20}$/;

  protected loading = true;
  protected saving = false;
  protected errorMessage = '';
  protected successMessage = '';
  protected detail: ConsignmentDetailDto | null = null;
  protected readonly statusOptions: ConsignmentStatus[] = ['Created', 'PickedUp', 'InTransit', 'Delivered'];

  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    sender: this.partyGroup(),
    receiver: this.partyGroup(),
    billing: this.formBuilder.nonNullable.group({
      orderPrice: [0, [Validators.required, Validators.min(0)]],
      receivedAmount: [0, [Validators.required, Validators.min(0)]],
      balancePaymentMode: ['', [Validators.required]],
      balancePaymentNotes: ['', [Validators.required, Validators.minLength(2)]],
    }),
    driver: this.formBuilder.nonNullable.group({
      vehicleNumber: ['', [Validators.required, Validators.minLength(3)]],
      driverName: ['', [Validators.required, Validators.minLength(2)]],
      driverContactNo: ['', [Validators.required, Validators.pattern(ConsignmentDetail.phonePattern)]],
      secondContactNo: ['', [Validators.required, Validators.pattern(ConsignmentDetail.phonePattern)]],
      ownerContactNo: ['', [Validators.required, Validators.pattern(ConsignmentDetail.phonePattern)]],
      driverEmail: ['', [Validators.required, Validators.email]],
    }),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly consignmentService: ConsignmentService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid consignment id.';
      this.loading = false;
      return;
    }

    this.load(id);
  }

  protected save(): void {
    if (!this.detail || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.successMessage = '';

    const payload = this.form.getRawValue() as CreateConsignmentRequest;
    this.consignmentService.update(this.detail.id, payload).subscribe({
      next: (updated) => {
        this.detail = updated;
        this.patchForm(updated);
        this.successMessage = 'Consignment updated.';
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.resolveErrorMessage(error, 'Could not update consignment.');
        this.saving = false;
      },
    });
  }

  protected updateStatus(status: string): void {
    if (!this.detail) {
      return;
    }

    if (!this.statusOptions.includes(status as ConsignmentStatus)) {
      return;
    }

    const resolvedStatus = status as ConsignmentStatus;

    this.consignmentService.updateStatus(this.detail.id, resolvedStatus).subscribe({
      next: () => {
        if (this.detail) {
          this.detail.status = resolvedStatus;
          this.successMessage = `Status updated to ${resolvedStatus}.`;
        }
      },
      error: () => {
        this.errorMessage = 'Could not update status.';
      },
    });
  }

  private load(id: number): void {
    this.loading = true;
    this.consignmentService.detail(id).subscribe({
      next: (data) => {
        this.detail = data;
        this.patchForm(data);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.resolveErrorMessage(error, 'Could not load consignment detail.');
        this.loading = false;
      },
    });
  }

  private patchForm(data: ConsignmentDetailDto): void {
    this.form.setValue({
      sender: data.sender,
      receiver: data.receiver,
      billing: data.billing,
      driver: data.driver,
    });
  }

  private partyGroup() {
    return this.formBuilder.nonNullable.group({
      companyName: ['', [Validators.required]],
      contactPerson1Name: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson1Phone: ['', [Validators.required, Validators.pattern(ConsignmentDetail.phonePattern)]],
      contactPerson2Name: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson2Phone: ['', [Validators.required, Validators.pattern(ConsignmentDetail.phonePattern)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  private resolveErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (error.status === 401) {
      return 'Your admin session has expired. Please log in again.';
    }

    if (error.status === 400 && error.error?.errors) {
      return 'Validation failed. Please review all fields before submitting.';
    }

    return fallback;
  }
}
