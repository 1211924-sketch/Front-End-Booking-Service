import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/material.imports';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

import { AuthService } from '../../../core/services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class CustomerLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  loading = false;
  serverError = '';

  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
      ],
    ],
  });
  goToRegister() {
    this.router.navigate(['/customer/register']);
  }

  goToResetPassword() {
    this.router.navigate(['/customer/reset-password']);
  }

  loginError = false;
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.serverError = '';

    this.auth
      .login(this.loginForm.value as any)
      .pipe(
        catchError((e) => {
          this.serverError = e.message || 'بيانات الدخول غير صحيحة';
          return of(null);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((res) => {
        if (!res) return;
        this.router.navigateByUrl('/customer/home');
      });
  }

  // continueWithGoogle() {
  //   window.open(`${location.origin}/api/auth/google`, '_self'); // أو رابط الـ BE لـ OAuth
  // }
  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;
  //
  //     //  تحقق تجريبي مؤقت (محاكاة قاعدة بيانات)️
  //     const correctEmail = 'test@email.com';
  //     const correctPassword = '1234@Aa';
  //
  //     if (email === correctEmail && password === correctPassword) {
  //       console.log(' تسجيل الدخول ناجح');
  //       this.loginError = false;
  //       this.router.navigate(['/customer/home']);
  //     } else {
  //       console.log(' كلمة المرور أو البريد الإلكتروني غير صحيحة');
  //       this.loginError = true;
  //     }
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //   }
  // }
  //
  //
  //
  continueWithGoogle() {
    // انتقال فعلي لصفحة Google (تجريبياً يفتح صفحة Google)
    window.open('https://accounts.google.com', '_blank');
    // لاحقًا: ضع رابط OAuth الصحيح لسيرفرك
  }
}
