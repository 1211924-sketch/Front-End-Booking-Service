import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/material.imports';

@Component({
  selector: 'app-password-success',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './password-success.component.html',
  styleUrls: ['./password-success.component.scss'],
})
export class PasswordSuccessComponent {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['/customer/login']);
  }
}
