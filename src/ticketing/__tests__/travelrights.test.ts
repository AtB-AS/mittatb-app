import {carnetTravelRight} from './fixtures/carnet-travelright';
import {nightTravelRight} from './fixtures/night-travelright';
import {periodTravelRight} from './fixtures/period-travelright';
import {periodBoatTravelRight} from './fixtures/period-boat-travelright';
import {singleTravelRight} from './fixtures/single-travelright';
import {singleBoatTravelRight} from './fixtures/single-boat-travelright';
import {youthTravelRight} from './fixtures/youth-travelright';

import {TravelRight} from '../types';
import {isCarnetTravelRight} from '../utils';

describe('Travelright type', () => {
  // it('all should resolve to normal', async () => {
  //   expect(isTravelRight(nightTravelRight)).toBe(true);
  //   expect(isTravelRight(periodTravelRight)).toBe(true);
  //   expect(isTravelRight(periodBoatTravelRight as TravelRight)).toBe(true);
  //   expect(isTravelRight(singleTravelRight)).toBe(true);
  //   expect(isTravelRight(singleBoatTravelRight as TravelRight)).toBe(true);
  //   expect(isTravelRight(youthTravelRight)).toBe(true);
  //   expect(isTravelRight(carnetTravelRight)).toBe(true);
  // });

  it('non carnets should not resolve to carnet', async () => {
    expect(isCarnetTravelRight(nightTravelRight)).toBe(false);
    expect(isCarnetTravelRight(periodTravelRight)).toBe(false);
    expect(isCarnetTravelRight(periodBoatTravelRight as TravelRight)).toBe(
      false,
    );
    expect(isCarnetTravelRight(singleTravelRight)).toBe(false);
    expect(isCarnetTravelRight(singleBoatTravelRight as TravelRight)).toBe(
      false,
    );
    expect(isCarnetTravelRight(youthTravelRight)).toBe(false);
  });

  it('carnet should resolve to carnet', async () => {
    expect(isCarnetTravelRight(carnetTravelRight)).toBe(true);
  });

  // it('skoleskyss should not resolve to normal', async () => {
  //   expect(isTravelRight(skoleskyssTravelRight as any)).toBe(false);
  // });
});
