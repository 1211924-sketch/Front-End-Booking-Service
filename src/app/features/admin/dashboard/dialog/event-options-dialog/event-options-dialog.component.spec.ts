import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOptionsDialogComponent } from './event-options-dialog.component';

describe('EventOptionsDialogComponent', () => {
  let component: EventOptionsDialogComponent;
  let fixture: ComponentFixture<EventOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOptionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
