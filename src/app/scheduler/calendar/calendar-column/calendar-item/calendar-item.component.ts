import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { CalendarItem, Entry } from 'src/app/shared/entry.model';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css'],
})
export class CalendarItemComponent implements OnInit {
  @Input() calendarItem: CalendarItem;

  itemText: string;
  highlighted = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.hoveredCalendarItemId.subscribe((hoveredId: string) => {
      this.highlighted = hoveredId === this.calendarItem.id;
    });

    const entry = this.dataService.getEntry(this.calendarItem.id);


    this.itemText =
      entry.userName +
      '\n' +
      entry.description +
      '\n' +
      this.getDateTimeString(entry.startDateTime) +
      ' - ' +
      this.getDateTimeString(entry.endDateTime) +
      '\n';
  }

  onMouseEnter(): void {
    this.dataService.hoveredCalendarItemId.next(this.calendarItem.id);
  }

  onMouseLeave(): void {
    this.dataService.hoveredCalendarItemId.next('');
  }

  private getDateTimeString(date: Date): string {
    const timestr = date.toTimeString().slice(0, 5);
    const dateStr = date.toDateString().slice(4, 11);
    return timestr + ' ' + dateStr;
  }
}
