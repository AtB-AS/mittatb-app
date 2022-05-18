import {Leg} from '@atb/api/types/trips';
import {iterateWithNext} from '@atb/utils/array';
import {timeIsShort} from '@atb/screens/TripDetails/Details/utils';
import {differenceInSeconds, parseISO} from 'date-fns';

export function hasShortWaitTime(legs: Leg[]) {
  return iterateWithNext(legs)
    .map((pair) => {
      return differenceInSeconds(
        parseDateIfString(pair.next.expectedStartTime),
        parseDateIfString(pair.current.expectedEndTime),
      );
    })
    .filter((waitTime) => waitTime > 0)
    .some((waitTime) => timeIsShort(waitTime));
}

function parseDateIfString(date: any): Date {
  if (typeof date === 'string') {
    return parseISO(date);
  } else {
    return date;
  }
}
