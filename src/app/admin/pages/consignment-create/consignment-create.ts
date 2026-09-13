import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateConsignmentRequest, CreateConsignmentResponse, ConsignmentService } from '../../../core/services/consignment';

@Component({
  selector: 'app-consignment-create',
  standalone: false,
  templateUrl: './consignment-create.html',
})
export class ConsignmentCreate {
  private static readonly phonePattern = /^[0-9+\-()\s]{7,20}$/;

  protected loading = false;
  protected errorMessage = '';
  protected created: CreateConsignmentResponse | null = null;

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
      driverContactNo: ['', [Validators.required, Validators.pattern(ConsignmentCreate.phonePattern)]],
      secondContactNo: ['', [Validators.required, Validators.pattern(ConsignmentCreate.phonePattern)]],
      ownerContactNo: ['', [Validators.required, Validators.pattern(ConsignmentCreate.phonePattern)]],
      driverEmail: ['', [Validators.required, Validators.email]],
    }),
  });

  constructor(private readonly consignmentService: ConsignmentService) {}

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = this.form.getRawValue() as CreateConsignmentRequest;
    this.consignmentService.create(payload).subscribe({
      next: (response) => {
        this.created = response;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.resolveErrorMessage(error);
        this.loading = false;
      },
    });
  }

  private partyGroup() {
    return this.formBuilder.nonNullable.group({
      companyName: ['', [Validators.required]],
      contactPerson1Name: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson1Phone: ['', [Validators.required, Validators.pattern(ConsignmentCreate.phonePattern)]],
      contactPerson2Name: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson2Phone: ['', [Validators.required, Validators.pattern(ConsignmentCreate.phonePattern)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  private resolveErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Your admin session has expired. Please log in again.';
    }

    if (error.status === 400 && error.error?.errors) {
      return 'Validation failed. Please review all fields before submitting.';
    }

    return 'Could not create consignment. Check your session and API availability.';
  }
}
