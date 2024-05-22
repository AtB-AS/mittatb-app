import {carnet} from './fixtures/carnet-travelright';
import {night} from './fixtures/night-travelright';
import {period} from './fixtures/period-travelright';
import {periodBoat} from './fixtures/period-boat-travelright';
import {single} from './fixtures/single-travelright';
import {singleBoat} from './fixtures/single-boat-travelright';
import {youth} from './fixtures/youth-travelright';

import {TravelRight} from '../types';
import {isCarnetTravelRight, isPreActivatedTravelRight} from '../utils';

describe('Travelright type', () => {
  it('preactivated should resolve to preassigned', async () => {
    expect(isPreActivatedTravelRight(night as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(period as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(periodBoat as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(single as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(singleBoat as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(youth as TravelRight)).toBe(true);
  });

  it('preactivated should not resolve to carnet', async () => {
    expect(isCarnetTravelRight(night as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(period as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(periodBoat as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(single as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(singleBoat as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(youth as TravelRight)).toBe(false);
  });

  it('carnet should resolve to carnet', async () => {
    expect(isCarnetTravelRight(carnet as TravelRight)).toBe(true);
  });
  it('carnet should not resolve to preassigned', async () => {
    expect(isPreActivatedTravelRight(carnet as TravelRight)).toBe(false);
  });
});
