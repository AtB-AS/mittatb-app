import {
  dateWithReplacedTime,
  iso8601DurationToSeconds,
  secondsBetween,
} from '@atb/utils/date';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';
import {EstimatedCall} from '@atb/api/types/departures';
import {iterateWithNext} from '@atb/utils/array';
import {differenceInSeconds, parseISO} from 'date-fns';
import {
  Mode,
  TariffZone,
  DestinationDisplay,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {dictionary, TranslateFunction} from '@atb/translations';
import {APP_ORG} from '@env';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES = 1;

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
  const secondsDifference = Math.abs(secondsBetween(aimedTime, expectedTime));
  return secondsDifference <= DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_MINUTES * 60
    ? 'no-significant-difference'
    : 'significant-difference';
}

export const getNoticesForLeg = (leg: Leg) =>
  filterNotices([
    ...(leg.line?.notices || []),
    ...(leg.serviceJourney?.notices || []),
    ...(leg.serviceJourney?.journeyPattern?.notices || []),
    ...(leg.fromEstimatedCall?.notices || []),
  ]);

export const getNoticesForServiceJourney = (
  serviceJourney: ServiceJourneyWithEstCallsFragment,
  fromQuayId?: string,
) => {
  const focusedEstimatedCall =
    serviceJourney.estimatedCalls?.find(
      ({quay}) => quay?.id && quay.id === fromQuayId,
    ) || serviceJourney.estimatedCalls?.[0];

  return filterNotices([
    ...serviceJourney.notices,
    ...(serviceJourney.journeyPattern?.notices || []),
    ...serviceJourney.line.notices,
    ...(focusedEstimatedCall?.notices || []),
  ]);
};

export const getNoticesForEstimatedCall = (estimatedCall: EstimatedCall) => {
  return filterNotices([
    ...estimatedCall.notices,
    ...(estimatedCall.serviceJourney?.notices || []),
    ...(estimatedCall.serviceJourney?.line.notices || []),
    ...(estimatedCall.serviceJourney?.journeyPattern?.notices || []),
  ]);
};

/**
 * Filter notices by removing duplicates (by id), removing those without text,
 * and also sorting them since the order from Entur may change on each request.
 */
export const filterNotices = (
  notices: NoticeFragment[],
): Required<NoticeFragment>[] =>
  notices
    .filter((n): n is Required<NoticeFragment> => !!n.text)
    .filter(onlyUniquesBasedOnField('id'))
    .sort((s1, s2) => s1.id.localeCompare(s2.id));

export const TIME_LIMIT_IN_MINUTES = 3;

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

export function getDestinationLineName(
  t: TranslateFunction,
  destinationDisplay: DestinationDisplay | undefined,
) {
  const frontText = destinationDisplay?.frontText || '';
  const via = destinationDisplay?.via || [];
  if (via.length < 1) {
    return frontText;
  }
  let viaNames = via[0];
  if (via.length > 1) {
    viaNames =
      via.slice(0, -1).join(', ') +
      ` ${t(dictionary.listConcatWord)} ` +
      via[via.length - 1];
  }

  return frontText + ` ${t(dictionary.via)} ` + viaNames;
}

export function getLineName(t: TranslateFunction, leg: Leg) {
  const name =
    getDestinationLineName(t, leg.fromEstimatedCall?.destinationDisplay) ??
    leg.line?.name ??
    '';
  return leg.line?.publicCode
    ? isLegFlexibleTransport(leg)
      ? leg.line.publicCode
      : `${leg.line.publicCode} ${name}`
    : name;
}

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

export function hasShortWaitTimeAndNotGuaranteedCorrespondence(legs: Leg[]) {
  return iterateWithNext(legs)
    .map((pair) => {
      if (pair.current.interchangeTo?.guaranteed) {
        return 0;
      }
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

function isSignificantFootLegWalkOrWaitTime(leg: Leg, nextLeg?: Leg) {
  if (leg.mode !== 'foot') return true;

  const showWaitTime = !!nextLeg;
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  return mustWait || mustWalk;
}

export function getFilteredLegsByWalkOrWaitTime(tripPattern: TripPattern) {
  if (!!tripPattern?.legs?.length) {
    return tripPattern.legs.filter((leg, i) =>
      isSignificantFootLegWalkOrWaitTime(leg, tripPattern.legs[i + 1]),
    );
  } else {
    return [];
  }
}

export function canSellCollabTicket(tripPattern: TripPattern) {
  const someLegsByTrain = someLegsAreByTrain(tripPattern);
  const tariffZonesHaveZoneA = (tariffZones?: TariffZone[]) =>
    tariffZones?.some((a) => a.id === 'ATB:TariffZone:1');
  const allLegsInZoneA = tripPattern.legs
    .filter((a) => a.mode !== Mode.Foot)
    .every(
      (a) =>
        tariffZonesHaveZoneA(a.fromPlace.quay?.tariffZones) &&
        tariffZonesHaveZoneA(a.toPlace.quay?.tariffZones),
    );
  return someLegsByTrain && allLegsInZoneA && APP_ORG === 'atb';
}

function someLegsAreByTrain(tripPattern: TripPattern): boolean {
  return tripPattern.legs.some((leg) => leg.mode === Mode.Rail);
}

export function withinZoneIds(legs: Leg[]): string[] {
  const allZoneIds = new Set<string>();
  legs.forEach((leg) => {
    leg.fromPlace.quay?.tariffZones?.forEach((zone) => allZoneIds.add(zone.id));
    leg.toPlace.quay?.tariffZones?.forEach((zone) => allZoneIds.add(zone.id));
  });
  const containingZones = Array.from(allZoneIds).filter((zoneId) =>
    legs
      .filter((a) => a.mode !== Mode.Foot)
      .every(
        (leg) =>
          leg.fromPlace.quay?.tariffZones?.some((zone) => zone.id === zoneId) &&
          leg.toPlace.quay?.tariffZones?.some((zone) => zone.id === zoneId),
      ),
  );
  return containingZones;
}

export function isLegFlexibleTransport(leg: Leg): boolean {
  return !!leg.line?.flexibleLineType;
}

export function getPublicCodeFromLeg(leg: Leg): string {
  return leg.fromPlace?.quay?.publicCode || leg.line?.publicCode || '';
}

export function getLatestBookingDateFromLeg(leg: Leg): Date {
  const latestBookingTime = leg.bookingArrangements?.latestBookingTime; // e.g. '15:16:00'
  const expectedStartTime = leg.expectedStartTime; // e.g. '2023-07-14T17:56:32+02:00'

  const expectedStartDate = new Date(expectedStartTime);
  let latestBookingDate = new Date(expectedStartTime);

  const bookWhen = leg.bookingArrangements?.bookWhen;
  if (bookWhen === 'timeOfTravelOnly') {
    return latestBookingDate; // note: 'timeOfTravelOnly' is deprecated
  } else if (
    bookWhen === 'dayOfTravelOnly' ||
    bookWhen === 'untilPreviousDay' ||
    bookWhen === 'advanceAndDayOfTravel'
  ) {
    if (expectedStartDate && latestBookingTime) {
      latestBookingDate = dateWithReplacedTime(
        expectedStartDate,
        latestBookingTime,
        'HH:mm:ss',
      );
    }

    if (bookWhen !== 'dayOfTravelOnly') {
      if (
        latestBookingDate.getTime() > expectedStartDate.getTime() ||
        bookWhen === 'untilPreviousDay'
      ) {
        latestBookingDate.setDate(latestBookingDate.getDate() - 1);
      }
    }
  } else if (bookWhen === undefined || bookWhen === null) {
    const minimumBookingPeriod = leg.bookingArrangements?.minimumBookingPeriod;
    if (minimumBookingPeriod) {
      latestBookingDate.setSeconds(
        latestBookingDate.getSeconds() -
          iso8601DurationToSeconds(minimumBookingPeriod),
      );
    }
  }

  return latestBookingDate;
}

export function getEarliestBookingDateFromLeg(
  leg: Leg,
  flex_booking_number_of_days_available: number,
): Date {
  const latestBookingDate = getLatestBookingDateFromLeg(leg);

  let earliestBookingDate = new Date(latestBookingDate);
  earliestBookingDate.setDate(
    earliestBookingDate.getDate() - flex_booking_number_of_days_available,
  );

  return earliestBookingDate;
}

export function getLegRequiresBooking(leg: Leg): boolean {
  return isLegFlexibleTransport(leg);
}

export function getSecondsRemainingToLegBookingDeadline(
  leg: Leg,
  now: number,
): number {
  const latestBookingDate = getLatestBookingDateFromLeg(leg);
  return secondsBetween(new Date(now), latestBookingDate);
}

export function getSecondsRemainingToLegBookingAvailable(
  leg: Leg,
  now: number,
  flex_booking_number_of_days_available: number,
): number {
  const earliestBookingDate = getEarliestBookingDateFromLeg(
    leg,
    flex_booking_number_of_days_available,
  );
  return secondsBetween(new Date(now), earliestBookingDate);
}

const secondsInOneHour = 60 * 60;
export function getLegRequiresBookingUrgently(leg: Leg, now: number): boolean {
  if (!getLegRequiresBooking(leg)) {
    return false;
  }
  const secondsRemainingToDeadline = getSecondsRemainingToLegBookingDeadline(
    leg,
    now,
  );
  return (
    secondsRemainingToDeadline >= 0 &&
    secondsRemainingToDeadline < secondsInOneHour
  );
}

export function getIsTooEarlyToBookLeg(
  leg: Leg,
  now: number,
  flex_booking_number_of_days_available: number,
): boolean {
  if (!getLegRequiresBooking(leg)) {
    return false;
  }
  const secondsInNumberOfDaysAvailable =
    flex_booking_number_of_days_available * 24 * secondsInOneHour;
  const secondsRemainingToDeadline = getSecondsRemainingToLegBookingDeadline(
    leg,
    now,
  );
  return (
    secondsRemainingToDeadline >= secondsInOneHour &&
    secondsRemainingToDeadline > secondsInNumberOfDaysAvailable
  );
}

export function getIsTooLateToBookLeg(leg: Leg, now: number): boolean {
  if (!getLegRequiresBooking(leg)) {
    return false;
  }
  const secondsRemainingToDeadline = getSecondsRemainingToLegBookingDeadline(
    leg,
    now,
  );
  return secondsRemainingToDeadline < 0;
}

export function getLegBookingIsAvailableImminently(
  leg: Leg,
  now: number,
  flex_booking_number_of_days_available: number,
): boolean {
  if (!getLegRequiresBooking(leg)) {
    return false;
  }
  const secondsRemainingToAvailable = getSecondsRemainingToLegBookingAvailable(
    leg,
    now,
    flex_booking_number_of_days_available,
  );
  return (
    secondsRemainingToAvailable > 0 &&
    secondsRemainingToAvailable < secondsInOneHour
  );
}

export function getLegBookingIsAvailable(
  leg: Leg,
  now: number,
  flex_booking_number_of_days_available: number,
): boolean {
  const requiresBooking = getLegRequiresBooking(leg);
  const isTooEarly = getIsTooEarlyToBookLeg(
    leg,
    now,
    flex_booking_number_of_days_available,
  );
  const isTooLate = getIsTooLateToBookLeg(leg, now);

  return requiresBooking && !isTooEarly && !isTooLate;
}

export function getTripPatternBookingsRequiredCount(
  tripPattern: TripPattern,
): number {
  return tripPattern?.legs?.filter((leg) => getLegRequiresBooking(leg)).length;
}

export function getTripPatternRequiresBookingUrgently(
  tripPattern: TripPattern,
  now: number,
): boolean {
  return tripPattern?.legs?.some((leg) =>
    getLegRequiresBookingUrgently(leg, now),
  );
}

export function getIsTooLateToBookTripPattern(
  tripPattern: TripPattern,
  now: number,
): boolean {
  return tripPattern?.legs?.some((leg) => getIsTooLateToBookLeg(leg, now));
}
