import {createTripMapLegs} from '../utils';
import {Leg} from '@atb/api/types/trips';
import {ServiceJourneyPolylinesWithId} from '@atb/api/types/serviceJourney';

jest.mock('@atb/screen-components/travel-details-screens', () => ({
  isLineFlexibleTransport: jest.fn(),
}));

const transitLeg = (serviceJourneyId: string) =>
  ({serviceJourney: {id: serviceJourneyId}}) as Leg;
const footLeg = {mode: 'foot'} as Leg;

const mapLeg = (points: string, faded: boolean) => ({
  faded,
  pointsOnLink: {points, length: 2},
});

const polylines = (
  serviceJourneyId: string,
  mapLegs: ReturnType<typeof mapLeg>[],
): ServiceJourneyPolylinesWithId => ({serviceJourneyId, mapLegs});

describe('createTripMapLegs', () => {
  it('adds the faded part before boarding first, followed by the legs', () => {
    const legs = [footLeg, transitLeg('sj-1')];
    const before = mapLeg('before', true);

    const result = createTripMapLegs(legs, [
      polylines('sj-1', [before, mapLeg('main', false), mapLeg('after', true)]),
    ]);

    expect(result).toEqual([before, ...legs]);
  });

  it('adds the faded part for each transit leg', () => {
    const legs = [transitLeg('sj-1'), transitLeg('sj-2')];
    const before1 = mapLeg('before1', true);
    const before2 = mapLeg('before2', true);

    const result = createTripMapLegs(legs, [
      polylines('sj-1', [before1, mapLeg('main1', false)]),
      polylines('sj-2', [before2, mapLeg('main2', false)]),
    ]);

    expect(result).toEqual([before1, before2, ...legs]);
  });

  it('adds nothing when boarding at the first stop', () => {
    const legs = [transitLeg('sj-1')];

    const result = createTripMapLegs(legs, [
      polylines('sj-1', [mapLeg('main', false), mapLeg('after', true)]),
    ]);

    expect(result).toEqual(legs);
  });

  it('adds nothing for legs without polylines', () => {
    const legs = [transitLeg('sj-1')];

    expect(createTripMapLegs(legs, [])).toEqual(legs);
  });
});
