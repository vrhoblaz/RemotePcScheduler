import { Injectable } from '@angular/core';

import { Entry, CalendarItem } from './entry.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: Entry[] = [
    new Entry(
      new Date(2020, 10, 21, 10, 30),
      new Date(2020, 10, 21, 15, 0),
      'Blaž'
    ),
    new Entry(
      new Date(2020, 10, 21, 16, 30),
      new Date(2020, 10, 22, 15, 0),
      'Blaž'
    ),
    new Entry(
      new Date(2020, 10, 23, 16, 30),
      new Date(2020, 10, 25, 15, 0),
      'Blaž'
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
