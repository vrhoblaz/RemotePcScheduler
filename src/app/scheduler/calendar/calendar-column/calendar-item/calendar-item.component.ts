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

  highlighted = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.hoveredCalendarItemId.subscribe((hoveredId: string) => {
      this.highlighted = hoveredId === this.calendarItem.id;
    });
  }

  onMouseEnter() {
    this.dataService.hoveredCalendarItemId.next(this.calendarItem.id);
  }

  onMouseLeave() {
    this.dataService.hoveredCalendarItemId.next('');
  }
}
