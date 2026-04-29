/**
 * Different helper methods related to time calculations
 */
class TimeHelper {
  /**
   * Returns the difference in minutes
   * @param startTime start time in HH:MM
   * @param endTime end time in HH:MM
   */
  getTimeDurationInMin(startTime: string, endTime: string) {
    function toNumber(value: string) {
      return Number(value);
    }
    let start: number[] = startTime.split(':').map((n) => toNumber(n));
    let end: number[] = endTime.split(':').map((n) => toNumber(n));
    let startDate: number = new Date(0).setHours(start[0], start[1]);
    let endDate: number =
      start[0] > end[0]
        ? new Date(24 * 3600 * 1000).setHours(end[0], end[1])
        : new Date(0).setHours(end[0], end[1]);

    return (endDate - startDate) / (1000 * 60);
  }

  /**
   * Checks if end time is gt initial time
   * @param initialHr hours initially
   * @param initialMin mins initially
   * @param endHr hours at the end
   * @param endMin mins at the end
   */
  gtTime(initialHr: number, initialMin: number, endHr: number, endMin: number) {
    let initDate = new Date();
    let endDate = new Date();
    initDate.setHours(initialHr, initialMin);
    endDate.setHours(endHr, endMin);
    return initDate <= endDate;
  }

  /**
   * Check if two times (HH:MM) are equal within an allowed margin
   * @param time1 HH:MM of first time
   * @param time2 HH:MM of second time
   * @param minMargin allowed margin in min (default: 2 min)
   */
  timeIsEqualWithMargin(time1: string, time2: string, minMargin: number = 2) {
    const hr1 = parseInt(time1.split(':')[0]);
    const min1 = parseInt(time1.split(':')[1]);
    const hr2 = parseInt(time2.split(':')[0]);
    const min2 = parseInt(time2.split(':')[1]);
    let date1 = new Date();
    let date2 = new Date();
    date1.setHours(hr1, min1);
    date2.setHours(hr2, min2);

    return Math.abs(date1.getTime() - date2.getTime()) <= minMargin * 60 * 1000;
  }

  /**
   * Helper method to parse the minutes from a non-transit travel. Checks if the minutes are acceptable.
   * E.g. "Bike 1 h 30 min" and "Walk 19 min"
   * @param travelTime The travel time from the button text
   * @param expectedMins The expected minutes
   * @param minVariation Acceptable variation in minutes
   */
  isAcceptableMinVariation(
    travelTime: string,
    expectedMins: number,
    minVariation: number,
  ): boolean {
    const travelTimeMin = parseInt(/\s(\d+)\smin/.exec(travelTime)[0]);
    return (
      travelTimeMin <= expectedMins + minVariation &&
      travelTimeMin >= expectedMins - minVariation
    );
  }

  /**
   * Returns the date for the next weekday in question
   * @param weekday Weekdays numbered from 0 (Monday) to 6 (Sunday)
   */
  getNextWeekDayDate(weekday: number) {
    const today = new Date();
    const increaseDays = weekday - today.getDay() + 7;
    today.setDate(today.getDate() + increaseDays);

    // Increase with a week to get same week day IF it's holiday
    while (this.isHoliday(today.toISOString().split('T')[0])) {
      today.setDate(today.getDate() + 7);
    }
    return today.toDateString().split(' ');
  }

  // Anonymous Gregorian algorithm for Easter Sunday
  private easterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day));
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
  }

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private norwegianHolidays(year: number): Set<string> {
    const easter = this.easterSunday(year);
    const holidays = new Set<string>();

    // Fixed public holidays
    holidays.add(`${year}-01-01`); // New Year's Day
    holidays.add(`${year}-05-01`); // Labour Day
    holidays.add(`${year}-05-17`); // Constitution Day
    holidays.add(`${year}-12-25`); // Christmas Day
    holidays.add(`${year}-12-26`); // Second Day of Christmas

    // Easter-relative public holidays
    holidays.add(this.toISODate(this.addDays(easter, -3))); // Maundy Thursday
    holidays.add(this.toISODate(this.addDays(easter, -2))); // Good Friday
    holidays.add(this.toISODate(easter)); // Easter Sunday
    holidays.add(this.toISODate(this.addDays(easter, 1))); // Easter Monday
    holidays.add(this.toISODate(this.addDays(easter, 39))); // Ascension Day
    holidays.add(this.toISODate(this.addDays(easter, 50))); // Whit Monday

    // Christmas/New Year period with weekend transit schedules
    holidays.add(`${year}-12-24`);
    for (let day = 27; day <= 31; day++) {
      holidays.add(`${year}-12-${day}`);
    }

    return holidays;
  }

  /**
   * Check if a given date is a Norwegian public holiday or has weekend transit schedules
   * @param testDate format YYYY-MM-DD
   */
  isHoliday = (testDate: string): boolean => {
    const year = parseInt(testDate.split('-')[0]);
    return this.norwegianHolidays(year).has(testDate);
  };
}

export default new TimeHelper();
