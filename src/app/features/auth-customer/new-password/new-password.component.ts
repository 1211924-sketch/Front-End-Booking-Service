import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SHARED_IMPORTS } from '../../../shared/material.imports';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;

  passwordForm = this.fb.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit() {
    // 🧠 Extract token from query params (e.g. /reset-password?token=abc123)
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.invalid || !this.token) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const newPassword = this.passwordForm.value.newPassword!;

    this.auth.resetPassword({ token: this.token, newPassword }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = res.message || 'تم تغيير كلمة المرور بنجاح.';

        // Redirect to login after a few seconds
        setTimeout(() => this.router.navigate(['/customer/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'فشل في إعادة تعيين كلمة المرور.';
      },
    });
  }
}

