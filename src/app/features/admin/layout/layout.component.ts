import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class AdminLayoutComponent {
  constructor(public themeService: ThemeService) {}
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }


  menuItems = [
    { icon: 'trending_up', label: 'تطوير العلامة التجارية', path: '/admin/grow' },
    { icon: 'calendar_today', label: 'التقويم', path: '/admin/dashboard' },
    { icon: 'design_services', label: 'الخدمات', path: '/admin/services' },
    { icon: 'forum', label: 'التواصل', path: '/admin/connect' },
    { icon: 'payments', label: 'المدفوعات', path: '/admin/payments' },
    { icon: 'people', label: 'العملاء', path: '/admin/customer' },
    { icon: 'hub', label: 'التكاملات', path: '/admin/integrations' },
    { icon: 'settings', label: 'الإعدادات', path: '/admin/settings' },
  ];
}
