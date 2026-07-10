import {Leg} from '@atb/api/types/trips';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {FareProductTypeConfig} from '@atb/modules/configuration';
import {getTicketInfoForExpressBoatBookingTrip} from '../utils';

const makeLeg = (opts?: {
  submode?: TransportSubmode;
  hasDatedServiceJourney?: boolean;
  fromStopPlaceId?: string;
  toStopPlaceId?: string;
}): Leg =>
  ({
    transportSubmode:
      opts?.submode ?? TransportSubmode.HighSpeedPassengerService,
    datedServiceJourney:
      (opts?.hasDatedServiceJourney ?? true) ? {id: 'dsj-1'} : undefined,
    fromPlace: {
      quay: {stopPlace: {id: opts?.fromStopPlaceId ?? 'harbor-from'}},
    },
    toPlace: {quay: {stopPlace: {id: opts?.toStopPlaceId ?? 'harbor-to'}}},
  }) as unknown as Leg;

const harbors = [
  {id: 'harbor-from'},
  {id: 'harbor-to'},
] as unknown as StopPlaceFragment[];

const boatSingleConfigs = [
  {type: 'boat-single'},
] as unknown as FareProductTypeConfig[];

describe('getTicketInfoForExpressBoatBookingTrip', () => {
  it('returns ticket info for a boat-only trip with dated service journeys', () => {
    const legs = [
      makeLeg({toStopPlaceId: 'harbor-mid'}),
      makeLeg({fromStopPlaceId: 'harbor-mid'}),
    ];

    const result = getTicketInfoForExpressBoatBookingTrip(
      legs,
      boatSingleConfigs,
      harbors,
    );

    expect(result).toBeDefined();
    expect(result?.fromPlace.id).toBe('harbor-from');
    expect(result?.toPlace.id).toBe('harbor-to');
    expect(result?.legs).toHaveLength(2);
    expect(result?.fareProductTypeConfig.type).toBe('boat-single');
  });

  it('passes through ticketStartTime', () => {
    const result = getTicketInfoForExpressBoatBookingTrip(
      [makeLeg()],
      boatSingleConfigs,
      harbors,
      '2024-01-01T07:00:00Z',
    );

    expect(result?.ticketStartTime).toBe('2024-01-01T07:00:00Z');
  });

  it('returns undefined when the trip combines express boat with other modes', () => {
    const legs = [makeLeg(), makeLeg({submode: TransportSubmode.LocalBus})];

    expect(
      getTicketInfoForExpressBoatBookingTrip(legs, boatSingleConfigs, harbors),
    ).toBeUndefined();
  });

  it('returns undefined when an express boat leg lacks a dated service journey', () => {
    const legs = [makeLeg(), makeLeg({hasDatedServiceJourney: false})];

    expect(
      getTicketInfoForExpressBoatBookingTrip(legs, boatSingleConfigs, harbors),
    ).toBeUndefined();
  });

  it('returns undefined when there are no express boat legs', () => {
    const legs = [makeLeg({submode: TransportSubmode.LocalBus})];

    expect(
      getTicketInfoForExpressBoatBookingTrip(legs, boatSingleConfigs, harbors),
    ).toBeUndefined();
  });

  it('returns undefined when the from or to harbor is unknown', () => {
    const legs = [makeLeg({fromStopPlaceId: 'unknown-harbor'})];

    expect(
      getTicketInfoForExpressBoatBookingTrip(legs, boatSingleConfigs, harbors),
    ).toBeUndefined();
  });

  it('returns undefined when the boat-single config is missing', () => {
    expect(
      getTicketInfoForExpressBoatBookingTrip([makeLeg()], [], harbors),
    ).toBeUndefined();
  });
});
