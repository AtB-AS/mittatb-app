import {client} from '../client';
import {AxiosRequestConfig} from 'axios';
import {
  type BookingAvailabilityQueryVariables,
  type BookingTripsResult,
  type RefreshedTripPattern,
  TripPattern,
  TripsQuery,
} from '@atb/api/types/trips';
import {
  NonTransitTripsQueryVariables,
  TripsQueryVariables,
} from '@atb/api/types/generated/TripsQuery';
import Bugsnag from '@bugsnag/react-native';
import {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';

// see updateCallerRouteParams - ts safety missing
// query contains more data than the type says, which the bff currently doesn't allow
// should be fixed as part of router refactor
function cleanQuery(query: TripsQueryVariables) {
  const cleanQuery: TripsQueryVariables | NonTransitTripsQueryVariables = {
    to: {
      name: query.to.name,
      coordinates: query.to.coordinates,
      place: query.to.place,
    },
    from: {
      name: query.from.name,
      coordinates: query.from.coordinates,
      place: query.from.place,
    },
    when: query.when,
    arriveBy: query.arriveBy,
    cursor: query.cursor,
    transferSlack: query.transferSlack,
    transferPenalty: query.transferPenalty,
    waitReluctance: query.waitReluctance,
    walkReluctance: query.walkReluctance,
    walkSpeed: query.walkSpeed,
    modes: query.modes,
    includeCancellations: query.includeCancellations,
  };
  return cleanQuery;
}

// see updateCallerRouteParams - ts safety missing
// query contains more data than the type says, which the bff currently doesn't allow
// should be fixed as part of router refactor
function cleanNonTransitQuery(query: NonTransitTripsQueryVariables) {
  const cleanQuery: NonTransitTripsQueryVariables = {
    to: {
      name: query.to.name,
      coordinates: query.to.coordinates,
      place: query.to.place,
    },
    from: {
      name: query.from.name,
      coordinates: query.from.coordinates,
      place: query.from.place,
    },
    when: query.when,
    arriveBy: query.arriveBy,
    walkSpeed: query.walkSpeed,
    directModes: query.directModes,
  };
  return cleanQuery;
}

export async function tripsSearch(
  query: TripsQueryVariables,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery> {
  const url = 'bff/v2/trips';

  const results = await post<TripsQuery>(url, cleanQuery(query), opts);

  Bugsnag.leaveBreadcrumb('results', {
    patterns: results.trip?.tripPatterns ?? 'none',
  });

  return results;
}

export async function bookingAvailabilitySearch(
  query: BookingAvailabilityQueryVariables,
) {
  const url = 'bff/v2/trips/booking';

  const {searchTime, fromStopPlaceId, toStopPlaceId, ...body} = query;
  const queryParams = new URLSearchParams({
    ...(searchTime && {searchTime}),
    ...(fromStopPlaceId && {fromStopPlaceId}),
    ...(toStopPlaceId && {toStopPlaceId}),
  }).toString();

  const results = await post<BookingTripsResult>(
    `${url}?${queryParams}`,
    body,
    {authWithIdToken: true},
  );

  Bugsnag.leaveBreadcrumb('bookingAvailabilitySearch', {
    bookingAvailability: results,
  });

  return results;
}

export const nonTransitTripSearch = (
  query: NonTransitTripsQueryVariables,
  opts?: AxiosRequestConfig,
) =>
  post<TripPatternFragment[]>(
    'bff/v2/trips/non-transit',
    cleanNonTransitQuery(query),
    opts,
  );

export async function singleTripSearch(
  compressedQuery: string,
  opts?: AxiosRequestConfig,
): Promise<TripPattern> {
  const url = '/bff/v2/singleTrip';
  return await post<TripPattern>(url, {compressedQuery}, opts);
}

export async function refreshSingleTrip(
  tripPattern: TripPattern,
  opts?: AxiosRequestConfig,
): Promise<RefreshedTripPattern> {
  const url = '/bff/v3/singleTrip';
  const legStubs = tripPattern.legs.map((leg) =>
    leg.id
      ? {id: leg.id}
      : {
          mode: leg.mode,
          duration: leg.duration,
          distance: leg.distance,
          aimedStartTime: leg.aimedStartTime,
          aimedEndTime: leg.aimedEndTime,
          expectedStartTime: leg.expectedStartTime,
          expectedEndTime: leg.expectedEndTime,
          fromPlace: leg.fromPlace,
          toPlace: leg.toPlace,
          pointsOnLink: leg.pointsOnLink,
        },
  );
  return await post<RefreshedTripPattern>(url, {legStubs}, opts);
}

async function post<T>(
  url: string,
  query: any,
  opts?: AxiosRequestConfig<any>,
) {
  const response = await client.post<T>(url, query, {
    ...opts,
    skipErrorLogging: (error) => error.response?.status === 410,
  });

  return response.data;
}
