import { Component, Inject, PLATFORM_ID, ViewChild, NgZone } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogComponent } from './dialog/dialog.component';
import { EventOptionsDialogComponent } from './dialog/event-options-dialog/event-options-dialog.component';
import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  calendarOptions: any;
  isBrowser: boolean;

  //  إعدادات الطبيب (افتراضيًا)
  holidays: number[] = [5, 0]; // الجمعة والأحد
  workingHours = { start: '08:00:00', end: '18:00:00' };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) this.initCalendar();
  }

  //  تهيئة التقويم
  initCalendar() {
    const events: any[] = [
      //  مواعيد حقيقية هنا
    ];


    // أضف أحداث خلفية لأيام العطل
    const holidayEvents = this.generateHolidayBackgrounds();
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      allDaySlot: false,
      slotMinTime: this.workingHours.start,
      slotMaxTime: this.workingHours.end,
      slotDuration: '00:30:00',
      selectable: false,
      editable: true,
      nowIndicator: true,
      eventOverlap: false,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [...events, ...holidayEvents],
      dateClick: (info: any) => this.handleDateClick(info),
      eventClick: (info: any) => this.openEventOptionsDialog(info.event),
    };
  }

  /**  توليد أحداث خلفية لأيام العطل */
  generateHolidayBackgrounds() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const holidayEvents = [];

    // إنشاء أحداث خلفية للأسبوع الحالي وما بعده
    for (let i = 0; i < 30; i++) { // الشهر القادم مثلًا
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const day = d.getDay();

      if (this.holidays.includes(day)) {
        holidayEvents.push({
          start: d.toISOString().split('T')[0],
          end: d.toISOString().split('T')[0],
          display: 'background',
          backgroundColor: 'rgba(255, 99, 71, 0.25)', // لون خلفية العطلة
          borderColor: 'transparent'
        });
      }
    }
    return holidayEvents;
  }

  //  عند النقر على وقت في التقوي
  handleDateClick(info: any) {
    const clickedDate = new Date(info.dateStr);
    const day = clickedDate.getDay();

    //  منع الحجز في العطل
    if (this.holidays.includes(day)) {
      alert('❌ لا يمكن الحجز في أيام العطل.');
      return;
    }

    //  التحقق من أوقات الدوام
    const time = clickedDate.toTimeString().substring(0, 8);
    if (time < this.workingHours.start || time >= this.workingHours.end) {
      alert('⚠️ الوقت خارج أوقات الدوام.');
      return;
    }

    this.openCreateDialogManual({ date: info.dateStr });
  }

  // ➕ إضافة / تعديل موعد
  openCreateDialogManual(existingEvent: any = null) {
    // 🔴 تحقق أولاً من أن اليوم ليس عطلة
    const dateStr = existingEvent?.date || existingEvent?.startStr || null;

    if (dateStr) {
      const day = new Date(dateStr).getDay();
      if (this.holidays.includes(day)) {
        alert('❌ لا يمكن إضافة أو تعديل موعد في يوم عطلة.');
        return;
      }
    }

    const ref = this.dialog.open(DialogComponent, {
      width: '420px',
      direction: 'rtl',
      data: existingEvent
        ? {
          patientName: existingEvent.extendedProps.patientName || '',
          title: existingEvent.title,
          type: existingEvent.extendedProps.type || 'consultation',
          date: existingEvent.startStr.split('T')[0],
          time: existingEvent.startStr.split('T')[1]?.substring(0, 5),
          duration: 30
        }
        : {}
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        const colorMap: any = {
          consultation: '#42a5f5',
          treatment: '#4caf50',
          emergency: '#e53935'
        };

        const start = new Date(`${result.date}T${result.time}`);
        const end = new Date(start.getTime() + result.duration * 60000);
        const api = this.calendarComponent.getApi();

        // 🚫 منع التداخل الزمني
        const hasConflict = api.getEvents().some(e => start < e.end! && end > e.start!);
        if (hasConflict) {
          alert('⚠️ يوجد موعد آخر في نفس الوقت!');
          return;
        }

        // 🚫 تأكد مجددًا من عدم كون اليوم عطلة قبل الإضافة
        const day = start.getDay();
        if (this.holidays.includes(day)) {
          alert('🚫 لا يمكن إضافة موعد في يوم عطلة.');
          return;
        }

        api.addEvent({
          title: `${result.patientName} - ${result.title}`,
          start,
          end,
          color: colorMap[result.type],
          extendedProps: { patientName: result.patientName, type: result.type }
        });
      }
    });
  }


  // ⚙️ نافذة خيارات الحدث
  openEventOptionsDialog(event: any) {
    const ref = this.dialog.open(EventOptionsDialogComponent, {
      width: '380px',
      direction: 'rtl',
      data: event
    });

    ref.afterClosed().subscribe(action => {
      if (action === 'edit') {
        this.openCreateDialogManual(event);
      } else if (action === 'delete') {
        this.openDeleteDialog(event);
      }
    });
  }

  // 🗑️ نافذة حذف
  openDeleteDialog(event: any) {
    const ref = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      direction: 'rtl'
    });

    ref.afterClosed().subscribe(confirm => {
      if (confirm) {
        event.remove();
        alert('🗑️ تم حذف الموعد بنجاح.');
      }
    });
  }

  // 🔧 تحديث الإعدادات لاحقًا من واجهة الطبيب
  updateClinicSettings(holidays: number[], start: string, end: string) {
    this.holidays = holidays;
    this.workingHours = { start, end };
    this.initCalendar();
  }
}


// import { Component, Inject, PLATFORM_ID, ViewChild, NgZone } from '@angular/core';


// import { isPlatformBrowser, CommonModule } from '@angular/common';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { DialogComponent } from './dialog/dialog.component';
// import { EventOptionsDialogComponent } from './dialog/event-options-dialog/event-options-dialog.component';
// import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
//
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     FullCalendarModule,
//     CommonModule,
//     MatDialogModule,
//     MatButtonModule,
//     MatIconModule
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent {
//   @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
//   calendarOptions: any;
//   isBrowser: boolean;
//
//   //  إعدادات الطبيب
//   holidays: number[] = [5, 0]; // الجمعة والأحد عطلة افتراضيًا
//   workingHours = { start: '08:00:00', end: '18:00:00' }; // أوقات الدوام
//
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private dialog: MatDialog,
//     private ngZone: NgZone
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//
//     if (this.isBrowser) {
//       this.initCalendar();
//     }
//   }
//
//   //  تهيئة التقويم
//   initCalendar() {
//     this.calendarOptions = {
//       plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
//       initialView: 'timeGridWeek',
//       allDaySlot: false,
//       slotMinTime: this.workingHours.start,
//       slotMaxTime: this.workingHours.end,
//       slotDuration: '00:30:00',
//       selectable: false,
//       editable: true,
//       nowIndicator: true,
//       headerToolbar: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'dayGridMonth,timeGridWeek,timeGridDay'
//       },
//       events: [],
//       dateClick: (info: any) => this.handleDateClick(info),
//       eventClick: (info: any) => this.openEventOptionsDialog(info.event),
//       eventOverlap: false,
//     };
//   }
//
//   // منع الحجز في أيام العطل
//   handleDateClick(info: any) {
//     const clickedDate = new Date(info.dateStr);
//     const day = clickedDate.getDay();
//
//     if (this.holidays.includes(day)) {
//       alert('⚠️ هذا اليوم عطلة، لا يمكن حجز موعد.');
//       return;
//     }
//
//     const time = clickedDate.toTimeString().substring(0, 5);
//     if (time < this.workingHours.start || time >= this.workingHours.end) {
//       alert('⚠️ هذا الوقت خارج أوقات الدوام.');
//       return;
//     }
//
//     this.openCreateDialogManual({ date: info.dateStr });
//   }
//
//   //  نافذة إضافة/تعديل الموعد
//   openCreateDialogManual(existingEvent: any = null) {
//     const ref = this.dialog.open(DialogComponent, {
//       width: '420px',
//       direction: 'rtl',
//       data: existingEvent
//         ? {
//           patientName: existingEvent.extendedProps.patientName || '',
//           title: existingEvent.title,
//           type: existingEvent.extendedProps.type || 'consultation',
//           date: existingEvent.startStr.split('T')[0],
//           time: existingEvent.startStr.split('T')[1]?.substring(0, 5),
//           duration: 30
//         }
//         : {}
//     });
//
//     ref.afterClosed().subscribe(result => {
//       if (result) {
//         const colorMap: any = {
//           consultation: '#42a5f5',
//           treatment: '#4caf50',
//           emergency: '#e53935'
//         };
//
//         const start = new Date(`${result.date}T${result.time}`);
//         const end = new Date(start.getTime() + result.duration * 60000);
//         const api = this.calendarComponent.getApi();
//
//         //  منع التداخل الزمني
//         const hasConflict = api.getEvents().some(e => start < e.end! && end > e.start!);
//         if (hasConflict) {
//           alert('⚠️ يوجد موعد آخر في نفس الوقت!');
//           return;
//         }
//
//         //  إضافة الموعد الجديد
//         api.addEvent({
//           title: `${result.patientName} - ${result.title}`,
//           start,
//           end,
//           color: colorMap[result.type],
//           extendedProps: {
//             patientName: result.patientName,
//             type: result.type
//           }
//         });
//       }
//     });
//   }
//
//   //  نافذة الخيارات عند النقر على الموعد
//   openEventOptionsDialog(event: any) {
//     const ref = this.dialog.open(EventOptionsDialogComponent, {
//       width: '380px',
//       direction: 'rtl',
//       data: event
//     });
//
//     ref.afterClosed().subscribe(action => {
//       if (action === 'edit') {
//         this.openCreateDialogManual(event);
//       } else if (action === 'delete') {
//         this.openDeleteDialog(event);
//       }
//     });
//   }
//
//   // 🗑️ نافذة تأكيد الحذف
//   openDeleteDialog(event: any) {
//     const ref = this.dialog.open(DeleteDialogComponent, {
//       width: '350px',
//       direction: 'rtl'
//     });
//
//     ref.afterClosed().subscribe(confirm => {
//       if (confirm) {
//         event.remove();
//         alert('🗑️ تم حذف الموعد بنجاح.');
//       }
//     });
//   }
//
//   // ⚙️ لاحقًا يمكن تعديل العطل والدوام من واجهة الإعدادات
//   updateClinicSettings(holidays: number[], start: string, end: string) {
//     this.holidays = holidays;
//     this.workingHours = { start, end };
//     this.initCalendar();
//   }
// }
