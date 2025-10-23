
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/material.imports';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class CustomerLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }


  // فارغة دائمًا + تحقق بسيط
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    // (اختياري) نفس قيود المعقّد للتوافق مع المتطلب
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    ]],
  });
  goToRegister() {
    this.router.navigate(['/customeradin/register']);
  }

  goToResetPassword() {
    this.router.navigate(['/customeradim/reset-password']);
  }


  loginError = false;

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      //  تحقق تجريبي مؤقت (محاكاة قاعدة بيانات)️
      const correctEmail = 'test@email.com';
      const correctPassword = '1234@Aa';

      if (email === correctEmail && password === correctPassword) {
        console.log(' تسجيل الدخول ناجح');
        this.loginError = false;
        this.router.navigate(['/customeradmin/home']);
      } else {
        console.log(' كلمة المرور أو البريد الإلكتروني غير صحيحة');
        this.loginError = true;
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  continueWithGoogle() {
    window.open('https://accounts.google.com', '_blank');
    // لاحقًا: ضع رابط OAuth الصحيح لسيرفرك
  }
}
