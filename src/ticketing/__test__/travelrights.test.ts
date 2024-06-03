import {carnet} from './fixtures/carnet-travelright';
import {night} from './fixtures/night-travelright';
import {period} from './fixtures/period-travelright';
import {periodBoat} from './fixtures/period-boat-travelright';
import {single} from './fixtures/single-travelright';
import {singleBoat} from './fixtures/single-boat-travelright';
import {youth} from './fixtures/youth-travelright';

import {CarnetTravelRight, TravelRight} from '../types';
import {
  hasValidCarnetTravelRight,
  isCarnetTravelRight,
  isPreActivatedTravelRight,
} from '../utils';

const now = Date.now();

describe('Travelright type', () => {
  it('preactivated should resolve to preassigned', async () => {
    expect(isPreActivatedTravelRight(night)).toBe(true);
    expect(isPreActivatedTravelRight(period)).toBe(true);
    expect(isPreActivatedTravelRight(periodBoat as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(single)).toBe(true);
    expect(isPreActivatedTravelRight(singleBoat as TravelRight)).toBe(true);
    expect(isPreActivatedTravelRight(youth)).toBe(true);
  });

  it('preactivated should not resolve to carnet', async () => {
    expect(isCarnetTravelRight(night)).toBe(false);
    expect(isCarnetTravelRight(period)).toBe(false);
    expect(isCarnetTravelRight(periodBoat as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(single)).toBe(false);
    expect(isCarnetTravelRight(singleBoat as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(youth)).toBe(false);
  });

  it('carnet should resolve to carnet', async () => {
    expect(isCarnetTravelRight(carnet)).toBe(true);
  });
  it('carnet should not resolve to preassigned', async () => {
    expect(isPreActivatedTravelRight(carnet)).toBe(false);
  });
});

describe('Carnet travel rights', () => {
  it('is valid', async () => {
    expect(hasValidCarnetTravelRight([carnet], now)).toBe(true);
  });

  it('is not valid', async () => {
    const noAccessesCarnet: CarnetTravelRight = {
      ...carnet,
      usedAccesses: [],
    };
    expect(hasValidCarnetTravelRight([noAccessesCarnet], now)).toBe(false);
  });
});
