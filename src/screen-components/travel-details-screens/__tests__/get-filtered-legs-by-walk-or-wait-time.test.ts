import {addSeconds} from 'date-fns';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {getFilteredLegsByWalkOrWaitTime} from '../utils';

describe('getFilteredLegsByWalkOrWaitTime', () => {
  const nowDate = Date.now();
  const at = (seconds: number) => addSeconds(nowDate, seconds);

  /** A scheduled service. Never filtered, whatever its length. */
  const bus = (startSeconds: number, endSeconds: number): Leg =>
    ({
      mode: 'bus',
      duration: endSeconds - startSeconds,
      expectedStartTime: at(startSeconds),
      expectedEndTime: at(endSeconds),
      serviceJourney: {id: 'ATB:ServiceJourney:1'},
    }) as Leg;

  const walk = (startSeconds: number, durationSeconds: number): Leg =>
    ({
      mode: 'foot',
      duration: durationSeconds,
      expectedStartTime: at(startSeconds),
      expectedEndTime: at(startSeconds + durationSeconds),
    }) as Leg;

  const pattern = (legs: Leg[]) => ({legs}) as TripPattern;
  const modes = (legs: Leg[]) => legs.map((l) => l.mode);

  describe('by default', () => {
    it('drops a short walk between two services', () => {
      const legs = [bus(0, 600), walk(600, 20), bus(620, 1200)];
      expect(modes(getFilteredLegsByWalkOrWaitTime(pattern(legs)))).toEqual([
        'bus',
        'bus',
      ]);
    });

    it('drops a short walk to the destination', () => {
      const legs = [bus(0, 600), walk(600, 24)];
      expect(modes(getFilteredLegsByWalkOrWaitTime(pattern(legs)))).toEqual([
        'bus',
      ]);
    });

    it('keeps a walk longer than 30 seconds', () => {
      const legs = [bus(0, 600), walk(600, 120)];
      expect(modes(getFilteredLegsByWalkOrWaitTime(pattern(legs)))).toEqual([
        'bus',
        'foot',
      ]);
    });

    it('keeps a short walk followed by a real wait', () => {
      const legs = [bus(0, 600), walk(600, 20), bus(900, 1500)];
      expect(modes(getFilteredLegsByWalkOrWaitTime(pattern(legs)))).toEqual([
        'bus',
        'foot',
        'bus',
      ]);
    });

    it('never filters a service, however short', () => {
      const legs = [bus(0, 5), bus(5, 10)];
      expect(getFilteredLegsByWalkOrWaitTime(pattern(legs))).toHaveLength(2);
    });

    it('returns an empty list for a pattern with no legs', () => {
      expect(getFilteredLegsByWalkOrWaitTime(pattern([]))).toEqual([]);
    });
  });

  describe('with keepEndpointWalks', () => {
    const keep = {keepEndpointWalks: true};

    it('keeps the short walk to the destination', () => {
      const legs = [bus(0, 600), walk(600, 24)];
      expect(
        modes(getFilteredLegsByWalkOrWaitTime(pattern(legs), keep)),
      ).toEqual(['bus', 'foot']);
    });

    it('keeps the short walk from the origin', () => {
      const legs = [walk(0, 24), bus(24, 600)];
      expect(
        modes(getFilteredLegsByWalkOrWaitTime(pattern(legs), keep)),
      ).toEqual(['foot', 'bus']);
    });

    it('still drops a short walk between two services', () => {
      const legs = [bus(0, 600), walk(600, 20), bus(620, 1200)];
      expect(
        modes(getFilteredLegsByWalkOrWaitTime(pattern(legs), keep)),
      ).toEqual(['bus', 'bus']);
    });

    it('keeps both ends while dropping the middle', () => {
      const legs = [
        walk(0, 24),
        bus(24, 600),
        walk(600, 20),
        bus(620, 1200),
        walk(1200, 24),
      ];
      expect(
        modes(getFilteredLegsByWalkOrWaitTime(pattern(legs), keep)),
      ).toEqual(['foot', 'bus', 'bus', 'foot']);
    });

    it('keeps a trip that is only a short walk', () => {
      const legs = [walk(0, 24)];
      expect(getFilteredLegsByWalkOrWaitTime(pattern(legs), keep)).toHaveLength(
        1,
      );
    });
  });
});
