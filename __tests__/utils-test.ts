import {iterateWithNext} from '../src/utils/array';
import {addMinutes} from 'date-fns';
import {Leg} from '@atb/api/types/trips';
import {TIME_LIMIT_IN_MINUTES} from '../src/screens/TripDetails/Details/utils';
import {hasShortWaitTime} from '../src/screens/TripDetails/components/utils';

describe('IterateWithNext', () => {
  it('iterates correctly', () => {
    const array_with_one = [1];
    const array_with_even = [1, 2, 3, 4];
    const array_with_odd = [1, 2, 3];

    const iterateWithOne = iterateWithNext(array_with_one);
    expect(iterateWithOne).toEqual([]);

    const iterateWithEven = iterateWithNext(array_with_even);
    expect(iterateWithEven).toEqual([
      {current: 1, next: 2},
      {current: 2, next: 3},
      {current: 3, next: 4},
    ]);

    const iterateWithOdd = iterateWithNext(array_with_odd);
    expect(iterateWithOdd).toEqual([
      {current: 1, next: 2},
      {current: 2, next: 3},
    ]);
  });
});

describe('Short wait time evaluator', () => {
  const nowDate = Date.now();
  const Leg1: Leg = {
    expectedStartTime: nowDate,
    expectedEndTime: addMinutes(nowDate, 5),
  } as Leg;

  const Leg2: Leg = {
    expectedStartTime: addMinutes(nowDate, 5 + TIME_LIMIT_IN_MINUTES - 1),
    expectedEndTime: addMinutes(nowDate, 10),
  } as Leg;

  const Leg3: Leg = {
    expectedStartTime: addMinutes(nowDate, 5 + TIME_LIMIT_IN_MINUTES + 1),
    expectedEndTime: addMinutes(nowDate, 10),
  } as Leg;

  const Leg4: Leg = {
    expectedStartTime: addMinutes(nowDate, 15),
    expectedEndTime: addMinutes(nowDate, 20),
  } as Leg;
  it('catches a short wait', () => {
    const isShortWait = hasShortWaitTime([Leg1, Leg2]);
    expect(isShortWait).toBe(true);
  });
  it('passes on a long wait', () => {
    const isShortWait = hasShortWaitTime([Leg1, Leg3]);
    expect(isShortWait).toBe(false);
  });
  it('catches a short wait with more legs', () => {
    const isShortWait = hasShortWaitTime([Leg1, Leg2, Leg3, Leg4]);
    expect(isShortWait).toBe(true);
  });
  it('passes on only one leg', () => {
    const isShortWait = hasShortWaitTime([Leg1]);
    expect(isShortWait).toBe(false);
  });
});
