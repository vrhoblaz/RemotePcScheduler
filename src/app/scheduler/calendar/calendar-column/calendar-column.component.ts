import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { CalendarItem } from 'src/app/shared/entry.model';

@Component({
  selector: 'app-calendar-column',
  templateUrl: './calendar-column.component.html',
  styleUrls: ['./calendar-column.component.css'],
})
export class CalendarColumnComponent implements OnInit, OnDestroy {
  @Input() weekDay: string;
  @Input() dayIndex: number;
  date: Date;

  dateChangedSubs: Subscription;
  mondayDateSubs: Subscription;
  hourIndexes: number[] = [];
  calendarItems: CalendarItem[];

  constructor(private dataService: DataService) {
    for (let h = 0; h < 24; h++) {
      this.hourIndexes.push(h);
    }
  }

  ngOnInit(): void {
    this.dateChangedSubs = this.dataService.dataChanged.subscribe(() => {
      this.calendarItems = this.dataService.getDayEntries(this.date);
    });

    this.mondayDateSubs = this.dataService.mondayDate.subscribe(
      (monDate: Date) => {
        const newDate = new Date(monDate);
        newDate.setDate(monDate.getDate() + this.dayIndex);
        this.date = newDate;

        this.calendarItems = this.dataService.getDayEntries(this.date);
      }
    );

    const currDate = new Date();
    const weekDay = currDate.getDay() === 0 ? 6 : currDate.getDay() - 1;
    const mondayDate = new Date(currDate);

    mondayDate.setDate(currDate.getDate() - weekDay);
    this.dataService.mondayDate.next(mondayDate);
  }

  ngOnDestroy(): void {
    if (this.mondayDateSubs) {
      this.mondayDateSubs.unsubscribe();
    }
    if (this.dateChangedSubs) {
      this.dateChangedSubs.unsubscribe();
    }
  }
}
