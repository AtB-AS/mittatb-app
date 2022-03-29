import {Leg} from '@atb/api/types/trips';
import {iterateWithNext} from '@atb/utils/array';
import {timeIsShort} from '@atb/screens/TripDetails/Details/utils';
import {differenceInSeconds} from 'date-fns';

export function hasShortWaitTime(legs: Leg[]) {
  return iterateWithNext(legs)
    .map((pair) => {
      return differenceInSeconds(
        pair.next.expectedStartTime,
        pair.current.expectedEndTime,
      );
    })
    .filter((waitTime) => waitTime > 0)
    .some((waitTime) => timeIsShort(waitTime));
}
