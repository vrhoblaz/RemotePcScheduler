import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-hour',
  templateUrl: './calendar-hour.component.html',
  styleUrls: ['./calendar-hour.component.css']
})
export class CalendarHourComponent implements OnInit {
  @Input() hourIndex: number;

  constructor() { }

  ngOnInit(): void {
  }

}
