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
}

export default new TimeHelper();
