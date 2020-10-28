import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  weekDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  mondayDateSubs: Subscription;
  startDate: Date;
  endDate: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.mondayDateSubs = this.dataService.mondayDate.subscribe(
      (mondayDate: Date) => {
        this.startDate = new Date(mondayDate);
        this.endDate = new Date(mondayDate);
        this.endDate.setDate(this.endDate.getDate() + 6);

        this.cdRef.detectChanges();
      }
    );
  }

  onNextWeek(): void {
    const newMondayDate = new Date(this.startDate);
    newMondayDate.setDate(newMondayDate.getDate() + 7);
    this.dataService.mondayDate.next(newMondayDate);
  }

  onPreviousWeek(): void {
    const newMondayDate = new Date(this.startDate);
    newMondayDate.setDate(newMondayDate.getDate() - 7);
    this.dataService.mondayDate.next(newMondayDate);
  }

  ngOnDestroy(): void {
    if (this.mondayDateSubs) {
      this.mondayDateSubs.unsubscribe();
    }
  }
}
