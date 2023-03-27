/**
 * Different helper methods related to time calculations
 */
class TimeHelper {
  /**
   * Returns the difference in minutes
   * @param startTime: start time in HH:MM
   * @param endTime: end time in HH:MM
   */
  getTimeDurationInMin(startTime: string, endTime: string) {
    function toNumber(value) {
      return Number(value);
    }
    let start: number[] = startTime.split(':').map(toNumber);
    let end: number[] = endTime.split(':').map(toNumber);
    let startDate: number = new Date(0).setHours(start[0], start[1]);
    let endDate: number =
      start[0] > end[0]
        ? new Date(24 * 3600 * 1000).setHours(end[0], end[1])
        : new Date(0).setHours(end[0], end[1]);

    return (endDate - startDate) / (1000 * 60);
  }
}

export default new TimeHelper();
