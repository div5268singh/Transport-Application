import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateConsignmentRequest, CreateConsignmentResponse, ConsignmentService } from '../../../core/services/consignment';

@Component({
  selector: 'app-consignment-create',
  standalone: false,
  templateUrl: './consignment-create.html',
})
export class ConsignmentCreate {
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
      balancePaymentNotes: ['', [Validators.required]],
    }),
    driver: this.formBuilder.nonNullable.group({
      vehicleNumber: ['', [Validators.required]],
      driverName: ['', [Validators.required]],
      driverContactNo: ['', [Validators.required]],
      secondContactNo: ['', [Validators.required]],
      ownerContactNo: ['', [Validators.required]],
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
      error: () => {
        this.errorMessage = 'Could not create consignment. Check your session and API availability.';
        this.loading = false;
      },
    });
  }

  private partyGroup() {
    return this.formBuilder.nonNullable.group({
      companyName: ['', [Validators.required]],
      contactPerson1Name: ['', [Validators.required]],
      contactPerson1Phone: ['', [Validators.required]],
      contactPerson2Name: ['', [Validators.required]],
      contactPerson2Phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    });
  }
}
