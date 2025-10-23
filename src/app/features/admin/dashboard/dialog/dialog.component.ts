import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>إضافة موعد جديد</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>اسم المريض</mat-label>
          <input matInput formControlName="patientName" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>عنوان الزيارة</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>نوع الزيارة</mat-label>
          <mat-select formControlName="type">
            <mat-option value="consultation">استشارة</mat-option>
            <mat-option value="treatment">علاج</mat-option>
            <mat-option value="emergency">طوارئ</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>التاريخ</mat-label>
          <input matInput type="date" formControlName="date" />
        </mat-form-field>

        <!--  وقت الزيارة كقائمة جاهزة -->
        <mat-form-field appearance="outline" class="full">
          <mat-label>الوقت</mat-label>
          <mat-select formControlName="time">
            <mat-option *ngFor="let t of timeSlots" [value]="t">{{ t }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>المدة (بالدقائق)</mat-label>
          <mat-select formControlName="duration">
            <mat-option [value]="15">15 دقيقة</mat-option>
            <mat-option [value]="30">30 دقيقة</mat-option>
            <mat-option [value]="45">45 دقيقة</mat-option>
            <mat-option [value]="60">ساعة</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
        حفظ
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full { width: 100%; margin-bottom: 10px; }`]
})
export class DialogComponent {
  form: FormGroup;
  timeSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      patientName: ['', Validators.required],
      title: ['', Validators.required],
      type: ['consultation', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      duration: [30, Validators.required]
    });

    //  إنشاء قائمة الأوقات كل نصف ساعة (من 8 إلى 20)
    for (let h = 8; h <= 20; h++) {
      ['00', '30'].forEach(m => this.timeSlots.push(`${h.toString().padStart(2, '0')}:${m}`));
    }
  }

  save() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
