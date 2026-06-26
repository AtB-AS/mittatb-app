import {Leg} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {uniqueLegValues} from '../utils';

const leg = (partial: Partial<Leg>): Leg => partial as Leg;
const tripPattern = (...legs: Leg[]) => ({legs});

describe('uniqueLegValues', () => {
  it('returns an empty array when there are no trip patterns', () => {
    expect(uniqueLegValues([], (l) => l.mode)).toEqual([]);
  });

  it('returns an empty array when the trip patterns have no legs', () => {
    expect(
      uniqueLegValues([tripPattern(), tripPattern()], (l) => l.mode),
    ).toEqual([]);
  });

  it('flattens legs across all trip patterns and collects the selected value', () => {
    const result = uniqueLegValues(
      [tripPattern(leg({mode: Mode.Bus})), tripPattern(leg({mode: Mode.Rail}))],
      (l) => l.mode,
    );
    expect(result).toEqual([Mode.Bus, Mode.Rail]);
  });

  it('de-duplicates values across legs and trip patterns, keeping first-seen order', () => {
    const result = uniqueLegValues(
      [
        tripPattern(leg({mode: Mode.Bus}), leg({mode: Mode.Rail})),
        tripPattern(leg({mode: Mode.Bus}), leg({mode: Mode.Tram})),
      ],
      (l) => l.mode,
    );
    expect(result).toEqual([Mode.Bus, Mode.Rail, Mode.Tram]);
  });

  it('drops null and undefined values returned by the selector', () => {
    const result = uniqueLegValues(
      [tripPattern(leg({mode: Mode.Bus}), leg({}), leg({mode: Mode.Rail}))],
      (l) => l.mode,
    );
    expect(result).toEqual([Mode.Bus, Mode.Rail]);
  });

  it('drops values that are absent via optional chaining (e.g. line?.publicCode)', () => {
    const result = uniqueLegValues(
      [
        tripPattern(
          leg({line: {publicCode: '1'} as Leg['line']}),
          leg({}), // no line -> publicCode is undefined
          leg({line: {publicCode: '1'} as Leg['line']}), // duplicate
          leg({line: {publicCode: '2'} as Leg['line']}),
        ),
      ],
      (l) => l.line?.publicCode,
    );
    expect(result).toEqual(['1', '2']);
  });
});
