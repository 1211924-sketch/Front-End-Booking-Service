
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/material.imports';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  serverError = '';

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    dob: ['', [Validators.required]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    ]],
  });

  goToLogin() {
    this.router.navigate(['/customer/login']);
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.serverError = '';

    this.auth.register(this.registerForm.value as any)
      .pipe(
        catchError((e) => {
          this.serverError = e.message || 'تعذّر إنشاء الحساب';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(res => {
        if (!res) return;
        // ممكن بعد التسجيل تعمل login تلقائي أو تحوّل لصفحة تسجيل الدخول
        this.router.navigateByUrl('/customer/login');
      });
  }
  continueWithGoogle() {
    window.open(`${location.origin}/api/auth/google`, '_self'); // أو رابط الـ BE لـ OAuth
  }
  // onSubmit() {
  //   if (this.registerForm.valid) {
  //     console.log('بيانات التسجيل:', this.registerForm.value);
  //     // TODO: API إنشاء حساب
  //     this.router.navigate(['/customer/login']);
  //   } else {
  //     this.registerForm.markAllAsTouched();
  //   }
  // }
  //
  // continueWithGoogle() {
  //   window.open('https://accounts.google.com', '_blank');
  // }
}

