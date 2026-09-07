import {Leg} from '@atb/api/types/trips';
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
