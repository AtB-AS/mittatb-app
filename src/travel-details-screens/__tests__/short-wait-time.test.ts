import {addMinutes} from 'date-fns';
import {Leg} from '@atb/api/types/trips';
import {hasShortWaitTime, TIME_LIMIT_IN_MINUTES} from '../utils';

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

  const weirdLeg: Leg = {
    expectedStartTime: 'non parsable string',
    expectedEndTime: {weird: true},
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
    const isShortWait = hasShortWaitTime([Leg1, Leg2, Leg4]);
    expect(isShortWait).toBe(true);
  });
  it('passes on only one leg', () => {
    const isShortWait = hasShortWaitTime([Leg1]);
    expect(isShortWait).toBe(false);
  });
  it('passes with empty array', () => {
    const isShortWait = hasShortWaitTime([]);
    expect(isShortWait).toBe(false);
  });
  it('passes on weird data', () => {
    const isShortWait = hasShortWaitTime([weirdLeg, weirdLeg]);
    expect(isShortWait).toBe(false);
  });
});
