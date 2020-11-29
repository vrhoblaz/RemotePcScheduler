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

  fetchEntry(id: string): Observable<Entry> {
    return this.http.get<Entry>(
      `https://custom-pc-access.firebaseio.com/schedule/pc-1/${id}.json`
    );
  }

  fetchEntries(): void {
    this.isLoading.next(true);

    this.fetchEntriesObservable().subscribe((databaseItems) => {
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

  async updateEntry2(
    newEntry: Entry
  ): Promise<
    { status: string; val: Observable<Entry> } | { status: string; val: string }
  > {
    const databaseItem = { ...newEntry };
    delete databaseItem.calendarItems;

    await this.fetchEntries();

    const newStartDate = newEntry.startDateTime;
    const newEndDate = newEntry.endDateTime;

    let overlappingEntry: Entry = null;
    this.data.forEach((element) => {
      const oldStartDate = element.startDateTime;
      const oldEndDate = element.endDateTime;

      if (
        (newStartDate < oldEndDate && newEndDate > oldEndDate) ||
        (oldStartDate < newStartDate && oldEndDate > newStartDate) ||
        (oldStartDate < newEndDate && oldEndDate > newEndDate)
      ) {
        overlappingEntry = element;
        return;
      }
    });

    if (overlappingEntry) {
      const dateOptions = {
        hour: 'numeric',
        minute: 'numeric',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour12: false,
      };
      return {
        status: 'fail',
        val:
          'Termin ' +
          new Intl.DateTimeFormat('si-SL', dateOptions).format(
            overlappingEntry.startDateTime
          ) +
          ' to ' +
          new Intl.DateTimeFormat('si-SL', dateOptions).format(
            overlappingEntry.endDateTime
          ) +
          ' is already taken!',
      };
    }

    return {
      status: 'success',
      val: this.http.put<Entry>(
        `https://custom-pc-access.firebaseio.com/schedule/pc-1/${newEntry.id}.json`,
        databaseItem
      ),
    };
  }

  deleteEntry(id: string): Observable<null> {
    return this.http.delete<null>(
      `https://custom-pc-access.firebaseio.com/schedule/pc-1/${id}.json`
    );
  }

  private fetchEntriesObservable(): Observable<{ [key: string]: Entry }> {
    return this.http.get<{ [key: string]: Entry }>(
      'https://custom-pc-access.firebaseio.com/schedule/pc-1.json'
    );
  }
}
