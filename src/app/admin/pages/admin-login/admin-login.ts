import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuth } from '../../../core/services/admin-auth';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin implements OnInit {
  protected loginError = '';
  protected isSubmitting = false;
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['admin', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private readonly adminAuth: AdminAuth,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly seo: Seo,
  ) {}

  ngOnInit(): void {
    const authError = this.route.snapshot.queryParamMap.get('authError');
    if (authError === 'service-unavailable') {
      this.loginError = 'Admin authentication service is unavailable. Please try again in a moment.';
    }

    this.seo.setRouteMeta(
      'Admin Login for Content and Asset Uploads',
      'Secure login for dispatch administrators to upload heavy freight banners, posters, and fleet videos.',
    );
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginError = '';
    this.isSubmitting = true;

    try {
      const isAuthenticated = await this.adminAuth.login(
        this.form.controls.username.getRawValue(),
        this.form.controls.password.getRawValue(),
      );

      if (!isAuthenticated) {
        this.loginError = 'Invalid username or password. Please try again.';
        return;
      }

      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/admin';
      await this.router.navigateByUrl(redirectTo);
    } catch {
      this.loginError = 'Unable to reach the admin authentication service. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
