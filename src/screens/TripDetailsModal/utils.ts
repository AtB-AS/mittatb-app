import {EstimatedCall} from '../../sdk';
import {secondsBetween, formatToClock} from '../../utils/date';

// @TODO should be in external configuration at some point, or at least estimeted better.
const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES = 2;

export function getAimedTimeIfLargeDifference(
  call?: EstimatedCall,
  differenceInMinutes: number = DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES,
) {
  if (!call) return undefined;
  if (
    secondsBetween(call.aimedDepartureTime, call.expectedDepartureTime) <=
    differenceInMinutes * 60
  ) {
    return undefined;
  }
  return formatToClock(call.aimedDepartureTime);
}
