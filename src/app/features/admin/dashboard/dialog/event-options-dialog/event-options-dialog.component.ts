import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-options-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>تفاصيل الموعد</h2>
    <mat-dialog-content>
      <p><strong>المريض:</strong> {{ data.title }}</p>
      <p><strong>تاريخ:</strong> {{ data.start | date:'fullDate' }}</p>
      <p><strong>الوقت:</strong> {{ data.start | date:'shortTime' }}</p>
      <p *ngIf="data.end"><strong>النهاية:</strong> {{ data.end | date:'shortTime' }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button color="accent" (click)="edit()">
        <mat-icon>edit</mat-icon> تعديل
      </button>
      <button mat-stroked-button color="warn" (click)="delete()">
        <mat-icon>delete</mat-icon> حذف
      </button>
      <button mat-button (click)="close()">إغلاق</button>
    </mat-dialog-actions>
  `
})
export class EventOptionsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<EventOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close('close');
  }

  edit() {
    this.dialogRef.close('edit');
  }

  delete() {
    this.dialogRef.close('delete');
  }
}
