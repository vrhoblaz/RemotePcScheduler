import { Component, Input, OnInit } from '@angular/core';
import { CalendarItem, Entry } from 'src/app/shared/entry.model';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css'],
})
export class CalendarItemComponent implements OnInit {
  @Input() calendarItem: CalendarItem;

  constructor() {}

  ngOnInit(): void {}
}
