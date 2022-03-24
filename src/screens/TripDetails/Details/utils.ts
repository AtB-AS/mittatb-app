// @TODO Remote config? User settings?

import {Leg} from '@atb/api/types/trips';

const TIME_LIMIT_IN_MINUTES = 3;
const MIN_SIGNIFICANT_WALK_IN_SECONDS = 30;
const MIN_SIGNIFICANT_WAIT_IN_SECONDS = 30;

export function timeIsShort(seconds: number) {
  return seconds / 60 <= TIME_LIMIT_IN_MINUTES;
}
export function significantWalkTime(seconds: number) {
  return seconds > MIN_SIGNIFICANT_WALK_IN_SECONDS;
}
export function significantWaitTime(seconds: number) {
  return seconds > MIN_SIGNIFICANT_WAIT_IN_SECONDS;
}

export function getLineName(leg: Leg) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ??
    leg.line?.name ??
    '';
  return leg.line?.publicCode ? `${leg.line.publicCode} ${name}` : name;
}
