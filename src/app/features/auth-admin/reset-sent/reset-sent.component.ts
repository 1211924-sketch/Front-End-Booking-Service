import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/material.imports';

@Component({
  selector: 'app-reset-sent',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './reset-sent.component.html',
  styleUrls: ['./reset-sent.component.scss'],
})
export class ResetSentComponent {
  email: string | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'] || null;
  }

  backToLogin() {
    this.router.navigate(['/customeradmin/login']);
  }
}
