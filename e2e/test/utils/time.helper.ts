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

  /**
   * Check if a given date is a holiday
   * @param testDate format YYYY-MM-DD
   */
  isHoliday = (testDate: string): boolean => {
    // List of holidays, i.e. days with either routes as a Saturday or a Sunday
    const holidays = [
      '2024-12-24',
      '2024-12-25',
      '2024-12-26',
      '2024-12-27',
      '2024-12-28',
      '2024-12-29',
      '2024-12-30',
      '2024-12-31',
      '2025-01-01',
      '2025-04-16',
      '2025-04-17',
      '2025-04-18',
      '2025-04-21',
      '2025-05-01',
      '2025-05-29',
      '2025-06-09',
      '2025-12-24',
      '2025-12-25',
      '2025-12-26',
      '2025-12-27',
      '2025-12-28',
      '2025-12-29',
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
    ];
    return holidays.includes(testDate);
  };
}

export default new TimeHelper();
