import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.resetForm.valid) {
      console.log('إرسال رابط لإعادة تعيين كلمة المرور:', this.resetForm.value.email);


      setTimeout(() => {
        this.router.navigate(['/customeradmin/reset-sent'], {
          state: { email: this.resetForm.value.email },
        });
      }, 1000);
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/customeradmin/login']);
  }
}
