import {addMinutes} from 'date-fns';
import {Leg} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  getFirstBoardingTime,
  getLastAlightingTime,
  getRemainingLegs,
} from '../utils';

const tripStart = new Date('2026-09-24T14:00:00+02:00');
const at = (minutes: number) => addMinutes(tripStart, minutes);

const leg = (
  startMinutes: number,
  endMinutes: number,
  mode = Mode.Bus,
  actual: {departure?: number; arrival?: number} = {},
): Leg =>
  ({
    mode,
    expectedStartTime: at(startMinutes).toISOString(),
    expectedEndTime: at(endMinutes).toISOString(),
    fromEstimatedCall:
      actual.departure !== undefined
        ? {actualDepartureTime: at(actual.departure).toISOString()}
        : undefined,
    toEstimatedCall:
      actual.arrival !== undefined
        ? {actualArrivalTime: at(actual.arrival).toISOString()}
        : undefined,
  }) as unknown as Leg;

describe('getRemainingLegs', () => {
  const walk = leg(-5, 0, Mode.Foot);
  const bus1 = leg(0, 30);
  const transferWalk = leg(30, 35, Mode.Foot);
  const bus2 = leg(40, 70);
  const legs = [walk, bus1, transferWalk, bus2];
  const now = (minutes: number) => at(minutes).getTime();

  it('is the whole trip before the first boarding', () => {
    expect(getRemainingLegs(legs, now(-10))).toBe(legs);
  });

  it('starts at the next boarding while on a leg', () => {
    expect(getRemainingLegs(legs, now(10))).toEqual([bus2]);
  });

  it('starts at the next boarding while walking between legs', () => {
    expect(getRemainingLegs(legs, now(32))).toEqual([bus2]);
  });

  it('starts at the last leg when every leg has departed', () => {
    expect(getRemainingLegs(legs, now(50))).toEqual([bus2]);
  });

  it('keeps the legs after the next boarding', () => {
    const endWalk = leg(70, 75, Mode.Foot);
    expect(getRemainingLegs([...legs, endWalk], now(10))).toEqual([
      bus2,
      endWalk,
    ]);
  });

  it('uses the actual departure when the bus left late', () => {
    const lateBus1 = leg(0, 30, Mode.Bus, {departure: 3});
    expect(getRemainingLegs([lateBus1, bus2], now(2))).toEqual([
      lateBus1,
      bus2,
    ]);
  });

  it('uses the expected departure while the bus has not left', () => {
    const delayedBus1 = leg(5, 35);
    expect(getRemainingLegs([delayedBus1, bus2], now(2))).toEqual([
      delayedBus1,
      bus2,
    ]);
  });

  it('is the whole trip when no leg needs a ticket', () => {
    const walkOnly = [leg(0, 20, Mode.Foot)];
    expect(getRemainingLegs(walkOnly, now(10))).toBe(walkOnly);
  });
});

describe('getFirstBoardingTime', () => {
  it('uses the actual departure when it is known', () => {
    const legs = [leg(0, 30, Mode.Bus, {departure: 4})];
    expect(getFirstBoardingTime(legs)).toEqual(at(4).getTime());
  });

  it('uses the expected departure otherwise', () => {
    expect(getFirstBoardingTime([leg(0, 30)])).toEqual(at(0).getTime());
  });

  it('ignores walking at the start of the trip', () => {
    const legs = [leg(-5, 0, Mode.Foot), leg(0, 30)];
    expect(getFirstBoardingTime(legs)).toEqual(at(0).getTime());
  });
});

describe('getLastAlightingTime', () => {
  it('uses the actual arrival when it is known', () => {
    const legs = [leg(0, 30, Mode.Bus, {arrival: 36})];
    expect(getLastAlightingTime(legs)).toEqual(at(36));
  });

  it('uses the expected arrival otherwise', () => {
    expect(getLastAlightingTime([leg(0, 30)])).toEqual(at(30));
  });
});
