
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/material.imports';

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
    this.router.navigate(['/customeradmin/login']);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('بيانات التسجيل:', this.registerForm.value);
      // TODO: API إنشاء حساب
      this.router.navigate(['/customeradmin/login']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  continueWithGoogle() {
    window.open('https://accounts.google.com', '_blank');
  }
}

