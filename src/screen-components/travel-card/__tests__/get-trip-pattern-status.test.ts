import {TripPattern, Leg} from '@atb/api/types/trips';
import {getTripPatternStatus} from '../utils';

jest.mock('@atb/screen-components/travel-details-screens', () => ({
  getTripPatternBookingStatus: (...args: unknown[]) =>
    require('@atb/screen-components/travel-details-screens/utils').getTripPatternBookingStatus(
      ...args,
    ),
}));

const futureTime = new Date(Date.now() + 3600 * 1000).toISOString();
const farFutureTime = new Date(Date.now() + 7200 * 1000).toISOString();
const pastTime = new Date(Date.now() - 3600 * 1000).toISOString();
const farPastTime = new Date(Date.now() - 7200 * 1000).toISOString();

const t = ((v: any) => v) as any;
const colors = {
  error: '#error',
  info: '#info',
  interactive: '#interactive',
};

function makeLeg(overrides: Partial<Leg> = {}): Leg {
  return {
    mode: 'bus',
    distance: 1000,
    duration: 600,
    aimedStartTime: futureTime,
    aimedEndTime: farFutureTime,
    expectedStartTime: futureTime,
    expectedEndTime: farFutureTime,
    realtime: false,
    situations: [],
    fromPlace: {name: 'A', longitude: 10, latitude: 63},
    toPlace: {name: 'B', longitude: 10.1, latitude: 63.1},
    intermediateEstimatedCalls: [],
    serviceJourneyEstimatedCalls: [],
    ...overrides,
  } as Leg;
}

function makeTripPattern(overrides: Partial<TripPattern> = {}): TripPattern {
  return {
    expectedStartTime: futureTime,
    expectedEndTime: farFutureTime,
    legs: [makeLeg()],
    ...overrides,
  } as TripPattern;
}

describe('getTripPatternStatus', () => {
  it('returns undefined when no conditions are met', () => {
    expect(getTripPatternStatus(makeTripPattern(), t, colors)).toBeUndefined();
  });

  it('returns impossible when status is impossible', () => {
    const result = getTripPatternStatus(
      makeTripPattern({status: 'impossible'}),
      t,
      colors,
    );
    expect(result?.type).toBe('impossible');
  });

  it('returns cancelled when any leg has fromEstimatedCall.cancellation', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        legs: [
          makeLeg(),
          makeLeg({
            fromEstimatedCall: {
              cancellation: true,
              aimedDepartureTime: futureTime,
              expectedDepartureTime: futureTime,
              stopPositionInPattern: 0,
              quay: {name: 'A'},
              notices: [],
            },
          }),
        ],
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('cancelled');
  });

  it('returns cancelled over stale when both apply', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        status: 'stale',
        legs: [
          makeLeg({
            fromEstimatedCall: {
              cancellation: true,
              aimedDepartureTime: futureTime,
              expectedDepartureTime: futureTime,
              stopPositionInPattern: 0,
              quay: {name: 'A'},
              notices: [],
            },
          }),
        ],
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('cancelled');
  });

  it('returns stale when status is stale', () => {
    const result = getTripPatternStatus(
      makeTripPattern({status: 'stale'}),
      t,
      colors,
    );
    expect(result?.type).toBe('stale');
  });

  it('returns requiresBooking when leg has bookingArrangements and booking is not late', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        legs: [
          makeLeg({
            bookingArrangements: {
              bookWhen: 'timeOfTravelOnly' as any,
            },
          }),
        ],
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('requiresBooking');
  });

  it('returns bookingDeadlineExceeded when leg has bookingArrangements and booking is late', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        legs: [
          makeLeg({
            aimedStartTime: farPastTime,
            bookingArrangements: {
              bookWhen: 'latestBookingTime' as any,
              latestBookingTime: '00:00:00',
            },
          }),
        ],
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('bookingDeadlineExceeded');
  });

  it('returns ended when expectedEndTime is in the past', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        expectedStartTime: farPastTime,
        expectedEndTime: pastTime,
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('ended');
  });

  it('returns started when expectedStartTime is in the past but expectedEndTime is not', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        expectedStartTime: pastTime,
        expectedEndTime: farFutureTime,
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('started');
  });

  it('prioritises impossible over cancelled', () => {
    const result = getTripPatternStatus(
      makeTripPattern({
        status: 'impossible',
        legs: [
          makeLeg({
            fromEstimatedCall: {
              cancellation: true,
              aimedDepartureTime: futureTime,
              expectedDepartureTime: futureTime,
              stopPositionInPattern: 0,
              quay: {name: 'A'},
              notices: [],
            },
          }),
        ],
      }),
      t,
      colors,
    );
    expect(result?.type).toBe('impossible');
  });
});
