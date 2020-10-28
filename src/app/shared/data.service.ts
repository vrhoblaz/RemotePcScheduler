import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Entry, CalendarItem } from './entry.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  hoveredCalendarItemId = new Subject<string>();
  mondayDate = new Subject<Date>();
  dataChanged = new Subject();

  data: Entry[] = [
    new Entry(
      new Date(2020, 9, 27, 15, 30),
      new Date(2020, 9, 27, 16, 30),
      'Blaž',
      'active',
      '',
      '1'
    ),
    new Entry(
      new Date(2020, 9, 27, 16, 30),
      new Date(2020, 9, 28, 15, 0),
      'Blaž',
      'lowComputing',
      '',
      '2'
    ),
    new Entry(
      new Date(2020, 9, 28, 16, 30),
      new Date(2020, 9, 30, 15, 0),
      'You',
      'mediumComputing',
      '',
      '3'
    ),
    new Entry(
      new Date(2020, 9, 31, 11, 30),
      new Date(2020, 9, 32, 15, 0),
      'You',
      'highComputing',
      '',
      '4'
    ),
    new Entry(
      new Date(2020, 10, 2, 11, 30),
      new Date(2020, 10, 5, 15, 0),
      'You',
      'highComputing',
      '',
      '4'
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

  addEntry(newEntry: Entry): void {
    this.data.push(newEntry);
    this.dataChanged.next();
  }
}
