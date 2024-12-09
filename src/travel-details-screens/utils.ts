import {
  dateWithReplacedTime,
  formatLocaleTime,
  formatToClockOrLongRelativeMinutes,
  iso8601DurationToSeconds,
  minutesBetween,
  secondsBetween,
} from '@atb/utils/date';
import {Leg, Line, TripPattern} from '@atb/api/types/trips';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';
import {EstimatedCall} from '@atb/api/types/departures';
import {iterateWithNext} from '@atb/utils/array';
import {differenceInSeconds, parseISO} from 'date-fns';
import {
  DestinationDisplay,
  Mode,
  TariffZone,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {dictionary, Language, TranslateFunction} from '@atb/translations';
import {APP_ORG} from '@env';
import {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';
import {BookingStatus, TripPatternBookingStatus} from './types';
import {Statuses} from '@atb/theme';
import {isDefined} from '@atb/utils/presence.ts';
import {screenReaderPause} from '@atb/components/text';
import {EstimatedCallWithMetadata} from '@atb/travel-details-screens/use-departure-data.ts';

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

export function formatDestinationDisplay(
  t: TranslateFunction,
  destinationDisplay: DestinationDisplay | undefined,
): string | undefined {
  if (destinationDisplay === undefined) {
    return undefined;
  }
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
    formatDestinationDisplay(t, leg.fromEstimatedCall?.destinationDisplay) ??
    leg.line?.name ??
    '';
  return leg.line?.publicCode
    ? isLineFlexibleTransport(leg.line)
      ? leg.line.publicCode
      : `${leg.line.publicCode} ${name}`
    : name;
}

export function getLineA11yLabel(
  destinationDisplay: DestinationDisplay | undefined,
  publicCode: string | undefined,
  t: TranslateFunction,
) {
  const a11yLine = publicCode
    ? `${t(dictionary.travel.line)} ${publicCode},`
    : '';
  const lineName = formatDestinationDisplay(t, destinationDisplay);
  const a11yLineName = lineName ? `${lineName}.` : '';
  return `${a11yLine} ${a11yLineName}`;
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

export function hasShortWaitTimeAndNotGuaranteedCorrespondence(
  legs: Leg[],
): boolean {
  return legs.reduce<{
    conclusion: boolean;
    prevEndTime?: Date;
    prevInterchangeGuaranteed?: boolean;
  }>(
    (state, leg) => {
      if (state.conclusion) return state;

      if (leg.mode == 'foot') {
        return {...state, prevEndTime: leg.expectedEndTime};
      }

      const waitTime = differenceInSeconds(
        parseDateIfString(leg.expectedStartTime),
        parseDateIfString(state.prevEndTime),
      );

      if (timeIsShort(waitTime) && state.prevInterchangeGuaranteed === false) {
        return {conclusion: true};
      }

      return {
        ...state,
        prevEndTime: leg.expectedEndTime,
        prevInterchangeGuaranteed: leg.interchangeTo?.guaranteed || false,
      };
    },
    {conclusion: false},
  ).conclusion;
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

export const isLineFlexibleTransport = (
  line?: Pick<Line, 'flexibleLineType'>,
) => !!line?.flexibleLineType;

export const getPublicCodeFromLeg = (leg: Leg) => leg.line?.publicCode || '';

export function getLatestBookingDate(
  bookingArrangements: BookingArrangementFragment,
  aimedStartTime: string,
): Date {
  const latestBookingTime = bookingArrangements.latestBookingTime; // e.g. '15:16:00'

  const aimedStartDate = new Date(aimedStartTime);
  let latestBookingDate = new Date(aimedStartTime);

  const bookWhen = bookingArrangements.bookWhen;
  if (bookWhen === 'timeOfTravelOnly') {
    return latestBookingDate; // note: 'timeOfTravelOnly' is deprecated
  } else if (
    bookWhen === 'dayOfTravelOnly' ||
    bookWhen === 'untilPreviousDay' ||
    bookWhen === 'advanceAndDayOfTravel'
  ) {
    if (aimedStartDate && latestBookingTime) {
      latestBookingDate = dateWithReplacedTime(
        aimedStartDate,
        latestBookingTime,
        {formatString: 'HH:mm:ss'},
      );
    }

    if (bookWhen !== 'dayOfTravelOnly') {
      if (
        latestBookingDate.getTime() > aimedStartDate.getTime() ||
        bookWhen === 'untilPreviousDay'
      ) {
        latestBookingDate.setDate(latestBookingDate.getDate() - 1);
      }
    }
  } else if (bookWhen === undefined || bookWhen === null) {
    const minimumBookingPeriod = bookingArrangements.minimumBookingPeriod;
    if (minimumBookingPeriod) {
      latestBookingDate.setSeconds(
        latestBookingDate.getSeconds() -
          iso8601DurationToSeconds(minimumBookingPeriod),
      );
    }
  }

  return latestBookingDate;
}

export function getEarliestBookingDate(
  bookingArrangements: BookingArrangementFragment,
  aimedStartTime: string,
  flex_booking_number_of_days_available: number,
): Date {
  const latestBookingDate = getLatestBookingDate(
    bookingArrangements,
    aimedStartTime,
  );

  const earliestBookingDate = new Date(latestBookingDate);
  earliestBookingDate.setDate(
    earliestBookingDate.getDate() - flex_booking_number_of_days_available,
  );

  return earliestBookingDate;
}

export function getSecondsRemainingToBookingDeadline(
  bookingArrangements: BookingArrangementFragment,
  aimedStartTime: string,
  now: number,
): number {
  const latestBookingDate = getLatestBookingDate(
    bookingArrangements,
    aimedStartTime,
  );
  return secondsBetween(new Date(now), latestBookingDate);
}

const secondsInOneHour = 60 * 60;

/**
 * Get bookings status based on the given booking arrangements and aimed start
 * time. Will return one of these values:
 * - 'none': When there is no booking arrangements
 * - 'early': It is too early to book the trip
 * - 'bookable': The trip may be booked
 * - 'late': The booking deadline has passed
 * '´
 * @param bookingArrangements The booking arrangements for the leg or estimated
 * call
 * @param aimedStartTime the aimed start time of the leg or estimated call
 * @param now The now value to use, if not given the Date.now() is used
 * @param flex_booking_number_of_days_available Number of days before latest
 * booking time the user may book, if not given then the returned status can
 * never be 'early'.
 */
export const getBookingStatus = (
  bookingArrangements: BookingArrangementFragment | undefined,
  aimedStartTime: string,
  now: number = Date.now(),
  flex_booking_number_of_days_available?: number,
): BookingStatus => {
  if (!bookingArrangements) return 'none';

  const secondsToDeadline = getSecondsRemainingToBookingDeadline(
    bookingArrangements,
    aimedStartTime,
    now,
  );

  if (secondsToDeadline < 0) {
    return 'late';
  }

  if (flex_booking_number_of_days_available) {
    const secondsBeforehandItCanBeBooked =
      flex_booking_number_of_days_available * 24 * secondsInOneHour;
    if (secondsToDeadline > secondsBeforehandItCanBeBooked) {
      return 'early';
    }
  }

  return 'bookable';
};

/**
 * Return a booking status for the whole trip pattern, based on the booking
 * status of each leg. Returns as of now either 'none', 'bookable' or 'late'.
 * @param tripPattern
 * @param now
 */
export function getTripPatternBookingStatus(
  tripPattern: TripPattern,
  now?: number,
): TripPatternBookingStatus {
  return tripPattern?.legs?.reduce<TripPatternBookingStatus>((status, leg) => {
    if (status === 'late') return status;

    const currentLegStatus = getBookingStatus(
      leg.bookingArrangements,
      leg.aimedStartTime,
      now,
    );

    switch (currentLegStatus) {
      case 'none':
        return status;
      case 'late':
        return 'late';
      case 'early':
      case 'bookable':
        return 'bookable';
    }
  }, 'none');
}

export const bookingStatusToMsgType = (
  bookingStatus: BookingStatus,
): Extract<Statuses, 'warning' | 'error'> | undefined => {
  switch (bookingStatus) {
    case 'none':
      return undefined;
    case 'early':
    case 'bookable':
      return 'warning';
    case 'late':
      return 'error';
  }
};

export function getIsTooLateToBookFlexLine(
  tripPattern: TripPattern,
  now: number,
): boolean {
  return tripPattern?.legs?.some(
    (leg) =>
      leg.line?.flexibleLineType &&
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime, now) ===
        'late',
  );
}

export const getShouldShowLiveVehicle = (
  estimatedCalls: Pick<EstimatedCall, 'aimedDepartureTime'>[],
  realtimeMapEnabled: boolean,
): boolean => {
  if (!realtimeMapEnabled) return false;

  const aimedStartTime: string | undefined =
    estimatedCalls[0]?.aimedDepartureTime;
  return aimedStartTime
    ? minutesBetween(aimedStartTime, new Date()) > -10
    : false;
};

export function getLineAndTimeA11yLabel(
  estimatedCall: EstimatedCallWithMetadata,
  publicCode: string,
  t: TranslateFunction,
  language: Language,
) {
  return [
    getLineA11yLabel(estimatedCall.destinationDisplay, publicCode, t),
    estimatedCall.realtime
      ? t(dictionary.a11yRealTimePrefix)
      : t(dictionary.a11yRouteTimePrefix),
    formatToClockOrLongRelativeMinutes(
      estimatedCall.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    ),
    secondsBetween(
      estimatedCall.aimedDepartureTime,
      estimatedCall.expectedDepartureTime,
    ) >= 60
      ? t(dictionary.a11yRouteTimePrefix) +
        formatLocaleTime(estimatedCall.aimedDepartureTime, language)
      : undefined,
  ]
    .filter(isDefined)
    .join(screenReaderPause);
}
