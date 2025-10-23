import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/material.imports';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent {
  private fb = inject(FormBuilder);

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

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('✅ كلمة المرور الجديدة:', this.passwordForm.value.newPassword);
      alert('تم تغيير كلمة المرور بنجاح (واجهة فقط)');
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
