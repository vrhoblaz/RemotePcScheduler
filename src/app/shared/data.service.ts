import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Entry, CalendarItem } from './entry.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  hoveredCalendarItemId = new Subject<string>();

  data: Entry[] = [
    new Entry(
      '1',
      new Date(2020, 10, 21, 10, 30),
      new Date(2020, 10, 21, 15, 0),
      'Blaž'
    ),
    new Entry(
      '2',
      new Date(2020, 10, 21, 16, 30),
      new Date(2020, 10, 22, 15, 0),
      'You'
    ),
    new Entry(
      '3',
      new Date(2020, 10, 23, 16, 30),
      new Date(2020, 10, 25, 15, 0),
      'You'
    ),
  ];

  constructor() {}

  getDayEntries(date: Date): CalendarItem[] {
    const allItems: CalendarItem[] = [];
    for (const entry of this.data) {
      allItems.push(...entry.calendarItems);
    }

    const matchingItems = allItems.filter((x) => {
      return (
        date.getFullYear() === x.date.getFullYear() &&
        date.getMonth() === x.date.getMonth() &&
        date.getDate() === x.date.getDate()
      );
    });
    return matchingItems;
  }
}
