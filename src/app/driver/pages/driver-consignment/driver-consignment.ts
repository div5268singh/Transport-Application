import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ConsignmentService, ConsignmentStatus, DriverConsignment } from '../../../core/services/consignment';
import { DriverAuth } from '../../../core/services/driver-auth';

@Component({
  selector: 'app-driver-consignment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driver-consignment.html',
})
export class DriverConsignmentPage implements OnInit {
  protected loading = true;
  protected saving = false;
  protected errorMessage = '';
  protected successMessage = '';
  protected data: DriverConsignment | null = null;

  private readonly fb = inject(FormBuilder);
  protected readonly locationForm = this.fb.nonNullable.group({
    cityName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    stateName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
  });

  constructor(
    private readonly consignmentService: ConsignmentService,
    private readonly driverAuth: DriverAuth,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  protected logout(): void {
    this.driverAuth.logout();
    window.location.href = '/#/driver/login';
  }

  protected canUpdateLocation(): boolean {
    if (!this.data) {
      return false;
    }

    return this.data.status === 'PickedUp' || this.data.status === 'InTransit';
  }

  protected submitLocation(): void {
    if (!this.canUpdateLocation()) {
      this.errorMessage = 'City/state can be updated only after pickup and before delivery.';
      return;
    }

    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.locationForm.getRawValue();
    this.consignmentService.postDriverLocation(payload).subscribe({
      next: () => {
        this.successMessage = 'Location updated successfully.';
        this.locationForm.reset({ cityName: '', stateName: '' });
        this.saving = false;
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = (error.error?.message as string) || 'Could not update location.';
        this.saving = false;
      },
    });
  }

  protected isStatus(status: ConsignmentStatus): boolean {
    return this.data?.status === status;
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.consignmentService.driverConsignment().subscribe({
      next: (result) => {
        this.data = result;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = (error.error?.message as string) || 'Unable to load driver consignment.';
        this.loading = false;
      },
    });
  }
}
