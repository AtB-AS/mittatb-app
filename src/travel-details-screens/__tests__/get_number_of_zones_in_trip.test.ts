import {Leg} from '@atb/api/types/trips';
import {getNumberOfZonesThroughoutTrip} from '../utils';

describe('getNumberOfZonesInTrip', () => {
  const r1 = 1;
  it(`should be ${r1} if whithin one zone throghout the trip.`, () => {
    const legs = [
      {
        fromPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
        toPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
      },
      {
        fromPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
        toPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
      },
    ] as Leg[];

    expect(getNumberOfZonesThroughoutTrip(legs)).toBe(r1);
  });

  const r2 = 2;
  it(`should be ${r2} if whithin two zones throghout the trip.`, () => {
    const legs = [
      {
        fromPlace: {quay: {tariffZones: [{name: 'Søre Sunnmøre'}]}},
        toPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
      },
      {
        fromPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
        toPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
      },
    ] as Leg[];

    expect(getNumberOfZonesThroughoutTrip(legs)).toBe(r2);
  });

  const r3 = 3;
  it(`should be ${r2} if whithin three zones throghout the trip.`, () => {
    const legs = [
      {
        fromPlace: {quay: {tariffZones: [{name: 'Søre Sunnmøre'}]}},
        toPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
      },
      {
        fromPlace: {quay: {tariffZones: [{name: 'Molde'}]}},
        toPlace: {quay: {tariffZones: [{name: 'Kristiansund'}]}},
      },
    ] as Leg[];

    expect(getNumberOfZonesThroughoutTrip(legs)).toBe(r3);
  });
});
