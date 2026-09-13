import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverAuth } from '../../../core/services/driver-auth';

@Component({
  selector: 'app-driver-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driver-login.html',
})
export class DriverLogin {
  protected loading = false;
  protected errorMessage = '';

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private readonly driverAuth: DriverAuth,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { username, password } = this.form.getRawValue();
      const success = await this.driverAuth.login(username.trim(), password);

      if (!success) {
        this.errorMessage = 'Invalid credentials or this login has expired.';
        this.loading = false;
        return;
      }

      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/driver/consignment';
      await this.router.navigateByUrl(redirectTo);
      this.loading = false;
    } catch {
      this.errorMessage = 'Login service is currently unavailable.';
      this.loading = false;
    }
  }
}
