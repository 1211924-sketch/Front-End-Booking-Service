import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // adjust import path
import { SHARED_IMPORTS } from '../../../shared/material.imports';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  errorMessage = '';
  successMessage = '';

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const email = this.resetForm.value.email!;

    this.auth.requestPasswordReset({ email }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = res.message || 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.';

        // navigate after small delay
        setTimeout(() => {
          this.router.navigate(['/customer/reset-sent'], {
            state: { email },
          });
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء إرسال البريد الإلكتروني.';
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/customer/login']);
  }
}

