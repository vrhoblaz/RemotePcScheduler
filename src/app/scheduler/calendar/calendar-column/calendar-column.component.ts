import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { CalendarItem } from 'src/app/shared/entry.model';

@Component({
  selector: 'app-calendar-column',
  templateUrl: './calendar-column.component.html',
  styleUrls: ['./calendar-column.component.css'],
})
export class CalendarColumnComponent implements OnInit {
  @Input() weekDay: string;
  @Input() dayIndex: number;

  hourIndexes: number[] = [];
  calendarItems: CalendarItem[];

  constructor(private dataService: DataService) {
    for (let h = 0; h < 24; h++) {
      this.hourIndexes.push(h);
    }
  }

  ngOnInit(): void {
    this.calendarItems = this.dataService.getDayEntries(
      new Date(2020, 10, 19 + this.dayIndex)
    );
  }
}
