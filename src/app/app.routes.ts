import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './features/admin/layout/layout.component';
import {authGuard} from './core/guards/auth.guard';
import {PasswordSuccessComponent} from './features/auth-customer/password-success/password-success.component';
import {NewPasswordComponent} from './features/auth-customer/new-password/new-password.component';


export const routes: Routes = [

  // -------------------- 🌐 Customer (الزبائن) --------------------
  {
    path: 'customer/login',
    loadComponent: () =>
      import('./features/auth-customer/login/login.component').then(m => m.CustomerLoginComponent),
  },
  {
    path: 'customer/register',
    loadComponent: () =>
      import('./features/auth-customer/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'customer/reset-password',
    loadComponent: () =>
      import('./features/auth-customer/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  //
  {
    path: 'customer/reset-sent',
    loadComponent: () =>
      import('./features/auth-customer/reset-sent/reset-sent.component').then(m => m.ResetSentComponent),
  },
  {
    path: 'customer/password-success',
    loadComponent: () =>
      import('./features/auth-customer/password-success/password-success.component').then(m => m.PasswordSuccessComponent),
  },
  {
    path: 'customer/new-password',
    loadComponent: () =>
      import('./features/auth-customer/new-password/new-password.component').then(m => m.NewPasswordComponent),
  },
















  // -------------------- ️ Customer Admin Auth --------------------
  {
    path: 'customeradmin/login',
    loadComponent: () =>
      import('./features/auth-admin/login/login.component').then(m => m.CustomerLoginComponent),
  },
  {
    path: 'customeradmin/register',
    loadComponent: () =>
      import('./features/auth-admin/register/register.component').then(m => m.RegisterComponent),
  },

  // -------------------- 🧭 Admin Layout + Child Pages --------------------
  {
    path: 'admin',
    // canActivate: [authGuard],
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'grow', loadComponent: () => import('./features/admin/grow/grow.component').then(m => m.GrowComponent) },
      { path: 'customer', loadComponent: () => import('./features/admin/customer/customer.component').then(m => m.CustomerComponent) },
      { path: 'services', loadComponent: () => import('./features/admin/services/services.component').then(m => m.ServicesComponent) },
      { path: 'connect', loadComponent: () => import('./features/admin/connect/connect.component').then(m => m.ConnectComponent) },
      { path: 'payments', loadComponent: () => import('./features/admin/payments/payments.component').then(m => m.PaymentsComponent) },
      { path: 'integrations', loadComponent: () => import('./features/admin/integrations/integrations.component').then(m => m.IntegrationsComponent) },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },


  // -------------------- 🔄 Default Redirect --------------------
  { path: '', redirectTo: 'customer/reset-password', pathMatch: 'full' },

  // -------------------- ❌ Wildcard --------------------
  // { path: '**', redirectTo: 'admin/dashboard' },
];
