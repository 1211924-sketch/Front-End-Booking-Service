import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {MatListOption, MatSelectionList} from '@angular/material/list';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,  // ✅ لحل خطأ *ngFor و *ngIf
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  weekDays = [
    { label: 'الأحد', value: 0 },
    { label: 'الإثنين', value: 1 },
    { label: 'الثلاثاء', value: 2 },
    { label: 'الأربعاء', value: 3 },
    { label: 'الخميس', value: 4 },
    { label: 'الجمعة', value: 5 },
    { label: 'السبت', value: 6 },
  ];

  holidays: number[] = []; // افتراضيًا الجمعة عطلة
  workHours: any = {};

  constructor() {
    this.weekDays.forEach(d => {
      this.workHours[d.value] = { start: '08:00', end: '17:00' };
    });
  }

  saveSettings() {
    const settings = {
      holidays: this.holidays,
      workHours: this.workHours
    };
    localStorage.setItem('clinicSettings', JSON.stringify(settings));
    alert('✅ تم حفظ إعدادات العيادة بنجاح!');
  }
}
