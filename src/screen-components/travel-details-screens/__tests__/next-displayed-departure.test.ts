import {Leg} from '@atb/api/types/trips';
import {arrivalRoundingMethod} from '@atb/utils/date';
import {nextDisplayedDeparture} from '../utils';

describe('nextDisplayedDeparture', () => {
  const leg = (mode: string, expectedStartTime: string) =>
    ({mode, expectedStartTime}) as Leg;

  const bus1 = leg('bus', '2024-01-01T10:00:00.000Z');
  const walk = leg('foot', '2024-01-01T10:10:00.000Z');
  const bus2 = leg('bus', '2024-01-01T10:15:00.000Z');

  it('returns the next transit departure', () => {
    expect(nextDisplayedDeparture([bus1, bus2], 0)).toBe(
      '2024-01-01T10:15:00.000Z',
    );
  });

  it('skips a walk leg, which shows no departure row', () => {
    expect(nextDisplayedDeparture([bus1, walk, bus2], 0)).toBe(
      '2024-01-01T10:15:00.000Z',
    );
  });

  it('skips several walk legs in a row', () => {
    expect(nextDisplayedDeparture([bus1, walk, walk, bus2], 0)).toBe(
      '2024-01-01T10:15:00.000Z',
    );
  });

  it('is undefined on the last leg', () => {
    expect(nextDisplayedDeparture([bus1, bus2], 1)).toBeUndefined();
  });

  it('is undefined when only walks follow', () => {
    expect(nextDisplayedDeparture([bus1, walk], 0)).toBeUndefined();
  });

  it('is undefined for an index past the end', () => {
    expect(nextDisplayedDeparture([bus1], 5)).toBeUndefined();
  });

  it('ignores legs before the index', () => {
    expect(nextDisplayedDeparture([bus1, walk, bus2], 1)).toBe(
      '2024-01-01T10:15:00.000Z',
    );
  });

  it('handles an empty trip', () => {
    expect(nextDisplayedDeparture([], 0)).toBeUndefined();
  });
});

describe('arrival rounding over whole trips', () => {
  const at = (time: string) => `2024-01-01T${time}.000Z`;
  const withTimes = (mode: string, start: string, end: string) =>
    ({mode, expectedStartTime: at(start), expectedEndTime: at(end)}) as Leg;
  const transit = (start: string, end: string) => withTimes('bus', start, end);
  const walking = (start: string, end: string) => withTimes('foot', start, end);

  const roundingFor = (legs: Leg[], index: number) =>
    arrivalRoundingMethod(
      legs[index].expectedEndTime,
      nextDisplayedDeparture(legs, index),
    );

  it('floors a same-minute transfer between transit legs', () => {
    const legs = [
      transit('10:00:00', '10:17:11'),
      transit('10:17:34', '10:30:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('floor');
  });

  it('floors across an intermediate walk when the connection is tight', () => {
    // The walk shows no departure row, so the tight transit departure behind
    // it is what the arrival has to agree with.
    const legs = [
      transit('10:00:00', '10:17:11'),
      walking('10:17:11', '10:17:20'),
      transit('10:17:34', '10:30:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('floor');
  });

  it('does not floor when a walk absorbs the transfer', () => {
    // The walk starts exactly at the arrival, so treating it as the next
    // departure would compare the arrival against itself and floor wrongly.
    const legs = [
      transit('10:00:00', '10:17:11'),
      walking('10:17:11', '10:19:00'),
      transit('10:22:40', '10:40:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('ceil');
  });

  it('does not floor before a trailing walk', () => {
    const legs = [
      transit('10:00:00', '10:17:11'),
      walking('10:17:11', '10:25:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('ceil');
  });

  it('does not floor the final arrival', () => {
    const legs = [
      transit('10:00:00', '10:17:11'),
      transit('10:17:34', '10:30:00'),
    ];
    expect(roundingFor(legs, 1)).toBe('ceil');
  });
});
