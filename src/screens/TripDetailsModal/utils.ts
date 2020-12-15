import {EstimatedCall} from '../../sdk';
import {secondsBetween, formatToClock} from '../../utils/date';

// @TODO should be in external configuration at some point, or at least estimeted better.
const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES = 2;

export type TimeValues = {
  aimedTime: string;
  expectedTime?: string;
  missingRealTime?: boolean;
};
type TimeRepresentationType =
  | 'no-realtime'
  | 'no-significant-difference'
  | 'significant-difference';

export function getTimeRepresentationType({
  missingRealTime,
  aimedTime,
  expectedTime,
}: TimeValues): TimeRepresentationType {
  if (missingRealTime) {
    return 'no-realtime';
  }
  if (!expectedTime) {
    return 'no-significant-difference';
  }
  return secondsBetween(aimedTime, expectedTime) <=
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES * 60
    ? 'no-significant-difference'
    : 'significant-difference';
}
