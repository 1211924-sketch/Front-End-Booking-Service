import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkThemeClass = 'dark-theme';
  private lightThemeClass = 'light-theme';
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // نتحقق أننا في المتصفح قبل استخدام localStorage
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      this.applyTheme(savedTheme === 'light' ? 'light' : 'dark');
    }
  }

  toggleTheme() {
    if (!this.isBrowser) return;

    const isDark = document.body.classList.contains(this.darkThemeClass);
    const newTheme = isDark ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  applyTheme(mode: 'light' | 'dark') {
    if (!this.isBrowser) return;

    document.body.classList.remove(this.darkThemeClass, this.lightThemeClass);
    document.body.classList.add(mode === 'dark' ? this.darkThemeClass : this.lightThemeClass);
    localStorage.setItem('theme', mode);
  }

  isDarkMode(): boolean {
    if (!this.isBrowser) return false;
    return document.body.classList.contains(this.darkThemeClass);
  }
}
