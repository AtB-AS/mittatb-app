import {secondsBetween} from '@atb/utils/date';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES = 1;

export type TimeValues = {
  isRealtime?: boolean;
  aimedTime: string;
  expectedTime?: string;
};
type RealtimeStateType =
  | 'no-realtime'
  | 'no-significant-difference'
  | 'significant-difference';

export function getRealtimeState({
  isRealtime,
  aimedTime,
  expectedTime,
}: TimeValues): RealtimeStateType {
  if (!isRealtime) {
    return 'no-realtime';
  }
  if (!expectedTime) {
    return 'no-significant-difference';
  }
  const secondsDifference = Math.abs(secondsBetween(aimedTime, expectedTime));
  return secondsDifference <= DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES * 60
    ? 'no-significant-difference'
    : 'significant-difference';
}
