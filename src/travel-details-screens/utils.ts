import {secondsBetween} from '@atb/utils/date';
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
} from '@atb/api/types/generated/journey_planner_v3_types';
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

export function getLineName(leg: Leg) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ??
    leg.line?.name ??
    '';
  return leg.line?.publicCode ? `${leg.line.publicCode} ${name}` : name;
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

export function isSignificantFootLegWalkOrWaitTime(leg: Leg, nextLeg?: Leg) {
  if (leg.mode !== 'foot') return true;

  const showWaitTime = !!nextLeg;
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  return mustWait || mustWalk;
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

export function isLegFlexibleTransport(leg: Leg): boolean {
  return !!leg.line?.flexibleLineType;
}

export type BookingRequirement = {
  requiresBooking: boolean;
  requiresBookingUrgently: boolean;
  isTooEarly?: boolean;
  isTooLate?: boolean;
};

// should import from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';?
// or maybe export from here instead?
type TripPatternWithKey = TripPattern & {key: string};

export type AvailableTripPattern = TripPatternWithKey & {
  bookingRequirement: BookingRequirement;
};

function setTimezoneFromDate(dateToEdit: Date, dateWithSourceTimezone: Date) {
  const timezoneDifferenceInMinutes =
    dateWithSourceTimezone.getTimezoneOffset() - dateToEdit.getTimezoneOffset();
  dateToEdit.setMinutes(dateToEdit.getMinutes() + timezoneDifferenceInMinutes);
}

function setDateFromDate(dateToEdit: Date, dateWithSourceDate: Date) {
  dateToEdit.setFullYear(
    dateWithSourceDate.getFullYear(),
    dateWithSourceDate.getMonth(),
    dateWithSourceDate.getDate(),
  );
}

function getLatestBookingDate(
  latestBookingTime: string, // e.g. '15:16:00'
  expectedStartTime: string, // e.g. '2023-07-14T17:56:32+02:00'
): Date {
  const expectedStartDate = new Date(expectedStartTime);
  let latestBookingDate = new Date(`1970-01-01T${latestBookingTime}Z`);

  setTimezoneFromDate(latestBookingDate, expectedStartDate);
  setDateFromDate(latestBookingDate, expectedStartDate);

  if (latestBookingDate.getTime() > expectedStartDate.getTime()) {
    latestBookingDate.setDate(latestBookingDate.getDate() - 1);
  }

  return latestBookingDate;
}

export function getAvailableTripPatterns(
  tripPatterns: TripPatternWithKey[],
  now: number, // change to hook and use useNow() in here instead?
): AvailableTripPattern[] {
  // todo: consider what if there are several flexibleTransportLegs?
  const tripPatternsWithBookingRequirements = tripPatterns.map(
    (tripPattern) => {
      const firstFlexibleTransportLeg = tripPattern?.legs.find((leg) =>
        isLegFlexibleTransport(leg),
      );
      const requiresBooking = !!firstFlexibleTransportLeg;

      let requiresBookingUrgently = false;
      let isTooEarly = false;
      let isTooLate = false;

      if (requiresBooking) {
        const latestBookingDate = getLatestBookingDate(
          firstFlexibleTransportLeg.bookingArrangements?.latestBookingTime,
          firstFlexibleTransportLeg.expectedStartTime,
        );

        const timeDiffMilliSeconds = latestBookingDate.getTime() - now;

        if (timeDiffMilliSeconds < 0) {
          isTooLate = true; // currently assuming bookWhen == 'advanceAndDayOfTravel'
        } else if (timeDiffMilliSeconds < 1 * 60 * 60 * 1000) {
          requiresBookingUrgently = true;
        } else if (timeDiffMilliSeconds > 7 * 24 * 60 * 60 * 1000) {
          isTooEarly = true;
        }
      }

      const bookingRequirement = {
        requiresBooking,
        requiresBookingUrgently,
        isTooEarly,
        isTooLate,
      };
      return {
        ...tripPattern,
        ...{bookingRequirement},
      };
    },
  );

  return tripPatternsWithBookingRequirements.filter(
    (tpwbr) => !tpwbr.bookingRequirement.isTooLate,
  );
}
