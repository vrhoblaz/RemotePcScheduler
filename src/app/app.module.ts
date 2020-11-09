import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from 'ng-pick-datetime';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { EditItemComponent } from './scheduler/edit-item/edit-item.component';
import { CalendarComponent } from './scheduler/calendar/calendar.component';
import { CalendarColumnComponent } from './scheduler/calendar/calendar-column/calendar-column.component';
import { CalendarItemComponent } from './scheduler/calendar/calendar-column/calendar-item/calendar-item.component';
import { CalendarHourComponent } from './scheduler/calendar/calendar-column/calendar-hour/calendar-hour.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';

export const MY_NATIVE_FORMATS = {
  fullPickerInput: {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false,
  },
  datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
  timePickerInput: { hour: 'numeric', minute: 'numeric', hour12: false },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SchedulerComponent,
    EditItemComponent,
    CalendarComponent,
    CalendarColumnComponent,
    CalendarItemComponent,
    CalendarHourComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    MatTooltipModule,
  ],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS }],
  bootstrap: [AppComponent],
})
export class AppModule {}
