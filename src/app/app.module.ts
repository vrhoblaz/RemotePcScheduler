import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { EditItemComponent } from './scheduler/edit-item/edit-item.component';
import { CalendarComponent } from './scheduler/calendar/calendar.component';
import { CalendarColumnComponent } from './scheduler/calendar/calendar-column/calendar-column.component';
import { CalendarItemComponent } from './scheduler/calendar/calendar-column/calendar-item/calendar-item.component';
import { CalendarHourComponent } from './scheduler/calendar/calendar-column/calendar-hour/calendar-hour.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SchedulerComponent,
    EditItemComponent,
    CalendarComponent,
    CalendarColumnComponent,
    CalendarItemComponent,
    CalendarHourComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
