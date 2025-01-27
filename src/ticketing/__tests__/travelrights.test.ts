import {carnetTravelRight} from './fixtures/carnet-travelright';
import {nightTravelRight} from './fixtures/night-travelright';
import {periodTravelRight} from './fixtures/period-travelright';
import {periodBoatTravelRight} from './fixtures/period-boat-travelright';
import {singleTravelRight} from './fixtures/single-travelright';
import {singleBoatTravelRight} from './fixtures/single-boat-travelright';
import {youthTravelRight} from './fixtures/youth-travelright';

import {TravelRight} from '../types';
import {flattenTravelRightAccesses} from '../utils';
import {skoleskyssTravelRight} from './fixtures/skoleskyss-travelright';

describe('Travelright type', () => {
  it('all should resolve to normal', async () => {
    expect(TravelRight.safeParse(nightTravelRight).success).toBe(true);
    expect(TravelRight.safeParse(periodTravelRight).success).toBe(true);
    expect(
      TravelRight.safeParse(periodBoatTravelRight as TravelRight).success,
    ).toBe(true);
    expect(TravelRight.safeParse(singleTravelRight).success).toBe(true);
    expect(
      TravelRight.safeParse(singleBoatTravelRight as TravelRight).success,
    ).toBe(true);
    expect(TravelRight.safeParse(youthTravelRight).success).toBe(true);
    expect(TravelRight.safeParse(carnetTravelRight).success).toBe(true);
  });

  it('non carnets should not have flattened accesses', async () => {
    expect(flattenTravelRightAccesses([nightTravelRight])).toBe(undefined);
    expect(flattenTravelRightAccesses([periodTravelRight])).toBe(undefined);
    expect(
      flattenTravelRightAccesses([periodBoatTravelRight as TravelRight]),
    ).toBe(undefined);
    expect(flattenTravelRightAccesses([singleTravelRight])).toBe(undefined);
    expect(
      flattenTravelRightAccesses([singleBoatTravelRight as TravelRight]),
    ).toBe(undefined);
    expect(flattenTravelRightAccesses([youthTravelRight])).toBe(undefined);
  });

  it('carnets should have flattened accesses', async () => {
    expect(flattenTravelRightAccesses([carnetTravelRight])).toBeDefined();
  });

  it('skoleskyss should not resolve to normal', async () => {
    expect(TravelRight.safeParse(skoleskyssTravelRight as any).success).toBe(
      false,
    );
  });
});
