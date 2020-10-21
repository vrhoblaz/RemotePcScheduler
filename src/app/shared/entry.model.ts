export class CalendarItem {
  constructor(
    public id: string,
    public date: Date,
    public topOffset: number,
    public height: number,
    public userName: string
  ) {}
}

export class Entry {
  public calendarItems: CalendarItem[] = [];

  constructor(
    public id: string,
    public startDateTime: Date,
    public endDateTime: Date,
    public userName: string,
  ) {
    // populate Calander items
    const yearStart = startDateTime.getFullYear();
    const monthStart = startDateTime.getMonth();
    const dayStart = startDateTime.getDate();
    const hourStart = startDateTime.getHours();
    const minuteStart = startDateTime.getMinutes();

    const yearEnd = endDateTime.getFullYear();
    const monthEnd = endDateTime.getMonth();
    const dayEnd = endDateTime.getDate();
    const hourEnd = endDateTime.getHours();
    const minuteEnd = endDateTime.getMinutes();

    if (
      yearStart === yearEnd &&
      monthStart === monthEnd &&
      dayStart === dayEnd
    ) {
      const topOffset = (minuteStart / 60 + hourStart) * 30;
      const height = (minuteEnd / 60 + hourEnd) * 30 - topOffset;
      const newCalendarItem = new CalendarItem(
        id,
        startDateTime,
        topOffset,
        height,
        userName
      );
      this.calendarItems.push(newCalendarItem);
    } else if (startDateTime < endDateTime) {
      // add first day
      let topOffset = (minuteStart / 60 + hourStart) * 30;
      let height = 24 * 30 - topOffset;
      let newCalendarItem = new CalendarItem(
        id,
        startDateTime,
        topOffset,
        height,
        userName
      );
      this.calendarItems.push(newCalendarItem);

      // add last day
      topOffset = 0;
      height = (minuteEnd / 60 + hourEnd) * 30;
      newCalendarItem = new CalendarItem(
        id,
        endDateTime,
        topOffset,
        height,
        userName
      );
      this.calendarItems.push(newCalendarItem);

      // loop through all days in between start and end date
      let currDate = new Date(
        yearStart,
        monthStart,
        dayStart + 1,
        23,
        59,
        59,
        999
      );
      while (currDate < endDateTime) {
        topOffset = 0;
        height = 24 * 30;
        newCalendarItem = new CalendarItem(
          id,
          currDate,
          topOffset,
          height,
          userName
        );
        this.calendarItems.push(newCalendarItem);

        currDate = new Date(
          yearStart,
          monthStart,
          currDate.getDate() + 1,
          23,
          59,
          59,
          999
        );
      }
    } else {
      console.log('End date should be bigger then Start date');
    }
  }
}
