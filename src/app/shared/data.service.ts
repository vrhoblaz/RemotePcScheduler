import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Entry, CalendarItem } from './entry.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  hoveredCalendarItemId = new Subject<string>();
  mondayDate = new Subject<Date>();
  dataChanged = new Subject();
  isLoading = new BehaviorSubject<boolean>(false);

  data: Entry[] = [];

  constructor(private http: HttpClient) {}

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

  getEntry(id: string): Entry {
    const filteredEntries = this.data.filter((x: Entry) => x.id === id);
    if (filteredEntries.length > 0) {
      return filteredEntries[0];
    }
    return null;
  }

  fetchEntries(): void {
    this.isLoading.next(true);
    this.http
      .get<{ [key: string]: Entry }>(
        'https://custom-pc-access.firebaseio.com/schedule/pc-1.json'
      )
      .subscribe((databaseItems) => {
        this.data = [];
        if (databaseItems) {
          const entries = Object.values(databaseItems);
          entries.forEach((element) => {
            const entry = new Entry(
              new Date(element.startDateTime),
              new Date(element.endDateTime),
              element.userName,
              element.requestType,
              element.description,
              element.id
            );
            this.data.push(entry);
          });
        }

        this.dataChanged.next();
        this.isLoading.next(false);
      });
  }

  updateEntry(newEntry: Entry): Observable<Entry> {
    const databaseItem = { ...newEntry };
    delete databaseItem.calendarItems;
    return this.http.put<Entry>(
      `https://custom-pc-access.firebaseio.com/schedule/pc-1/${newEntry.id}.json`,
      databaseItem
    );
  }

  deleteEntry(id: string): Observable<null> {
    return this.http.delete<null>(
      `https://custom-pc-access.firebaseio.com/schedule/pc-1/${id}.json`
    );
  }
}
