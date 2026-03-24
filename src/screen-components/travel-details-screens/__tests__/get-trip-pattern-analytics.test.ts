import {TripPattern} from '@atb/api/types/trips';
import {FareZone} from '@atb/modules/configuration';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {getTripPatternAnalytics} from '../utils';
import {ONE_HOUR_MS} from '@atb/utils/durations';

// "now" is the current time
const NOW = Date.now();
// in one hour
const EXPECTED_START_TIME = new Date(NOW + ONE_HOUR_MS);

function makeLeg(
  mode: Mode,
  from: {quayId: string; tariffZoneIds: string[]},
  to: {quayId: string; tariffZoneIds: string[]},
) {
  return {
    mode,
    fromPlace: {
      quay: {
        id: from.quayId,
        tariffZones: from.tariffZoneIds.map((id) => ({id})),
      },
    },
    toPlace: {
      quay: {
        id: to.quayId,
        tariffZones: to.tariffZoneIds.map((id) => ({id})),
      },
    },
  };
}

function makeFareZone(id: string, name: string): FareZone {
  return {id, name: {value: name}} as FareZone;
}

function makeTripPattern(
  legs: ReturnType<typeof makeLeg>[],
  duration: number,
  expectedStartTime: Date = EXPECTED_START_TIME,
): TripPattern {
  return {legs, duration, expectedStartTime} as unknown as TripPattern;
}

describe('getTripPatternAnalytics', () => {
  const fareZones = [
    makeFareZone('zone-a', 'Zone A'),
    makeFareZone('zone-b', 'Zone B'),
    makeFareZone('zone-c', 'Zone C'),
  ];

  it('should return correct analytics for a single-leg bus trip', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-b']},
        ),
      ],
      600,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result).toEqual({
      zones: ['Zone A', 'Zone B'],
      zoneCount: 2,
      legCount: 1,
      nonFootLegCount: 1,
      legModes: [Mode.Bus],
      duration: 600,
      secondsUntilStart: 3600,
    });
  });

  it('should count foot legs but exclude them from nonFootLegCount', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Foot,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-a']},
        ),
        makeLeg(
          Mode.Bus,
          {quayId: 'q2', tariffZoneIds: ['zone-a']},
          {quayId: 'q3', tariffZoneIds: ['zone-b']},
        ),
        makeLeg(
          Mode.Foot,
          {quayId: 'q3', tariffZoneIds: ['zone-b']},
          {quayId: 'q4', tariffZoneIds: ['zone-b']},
        ),
      ],
      1200,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.legCount).toBe(3);
    expect(result.nonFootLegCount).toBe(1);
    expect(result.legModes).toEqual([Mode.Foot, Mode.Bus, Mode.Foot]);
  });

  it('should deduplicate zones when multiple places are in the same zone', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-a']},
        ),
      ],
      300,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone A']);
    expect(result.zoneCount).toBe(1);
  });

  it('should deduplicate places with the same quay id across legs', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-b']},
        ),
        makeLeg(
          Mode.Tram,
          {quayId: 'q2', tariffZoneIds: ['zone-b']},
          {quayId: 'q3', tariffZoneIds: ['zone-c']},
        ),
      ],
      900,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone A', 'Zone B', 'Zone C']);
    expect(result.zoneCount).toBe(3);
    expect(result.legCount).toBe(2);
    expect(result.nonFootLegCount).toBe(2);
    expect(result.legModes).toEqual([Mode.Bus, Mode.Tram]);
  });

  it('should exclude zones not found in fareZones reference data', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-unknown']},
        ),
      ],
      400,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone A']);
    expect(result.zoneCount).toBe(1);
  });

  it('should handle places with no quay', () => {
    const tripPattern = makeTripPattern(
      [
        {
          mode: Mode.Foot,
          fromPlace: {quay: undefined},
          toPlace: {
            quay: {
              id: 'q1',
              tariffZones: [{id: 'zone-a'}],
            },
          },
        } as unknown as ReturnType<typeof makeLeg>,
      ],
      120,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone A']);
    expect(result.zoneCount).toBe(1);
    expect(result.legCount).toBe(1);
  });

  it('should handle a multi-modal trip', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Foot,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-a']},
        ),
        makeLeg(
          Mode.Bus,
          {quayId: 'q2', tariffZoneIds: ['zone-a']},
          {quayId: 'q3', tariffZoneIds: ['zone-b']},
        ),
        makeLeg(
          Mode.Rail,
          {quayId: 'q3', tariffZoneIds: ['zone-b']},
          {quayId: 'q4', tariffZoneIds: ['zone-c']},
        ),
        makeLeg(
          Mode.Foot,
          {quayId: 'q4', tariffZoneIds: ['zone-c']},
          {quayId: 'q5', tariffZoneIds: ['zone-c']},
        ),
      ],
      3600,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result).toEqual({
      zones: ['Zone A', 'Zone B', 'Zone C'],
      zoneCount: 3,
      legCount: 4,
      nonFootLegCount: 2,
      legModes: [Mode.Foot, Mode.Bus, Mode.Rail, Mode.Foot],
      duration: 3600,
      secondsUntilStart: 3600,
    });
  });

  it('should handle trip with no legs', () => {
    const tripPattern = makeTripPattern([], 0);

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result).toEqual({
      zones: [],
      zoneCount: 0,
      legCount: 0,
      nonFootLegCount: 0,
      legModes: [],
      duration: 0,
      secondsUntilStart: 3600,
    });
  });

  it('should handle empty fareZones reference data', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-b']},
        ),
      ],
      500,
    );

    const result = getTripPatternAnalytics(tripPattern, [], NOW);

    expect(result.zones).toEqual([]);
    expect(result.zoneCount).toBe(0);
    expect(result.legCount).toBe(1);
    expect(result.nonFootLegCount).toBe(1);
  });

  it('should match fare zone by first matching tariff zone', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a', 'zone-b']},
          {quayId: 'q2', tariffZoneIds: ['zone-c']},
        ),
      ],
      300,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone A', 'Zone C']);
    expect(result.zoneCount).toBe(2);
  });

  it('should handle places with null quay', () => {
    const tripPattern = makeTripPattern(
      [
        {
          mode: Mode.Bus,
          fromPlace: {quay: null},
          toPlace: {quay: null},
        } as unknown as ReturnType<typeof makeLeg>,
      ],
      200,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual([]);
    expect(result.zoneCount).toBe(0);
    expect(result.legCount).toBe(1);
    expect(result.nonFootLegCount).toBe(1);
  });

  it('should handle quay with empty tariffZones array', () => {
    const tripPattern = makeTripPattern(
      [
        {
          mode: Mode.Bus,
          fromPlace: {quay: {id: 'q1', tariffZones: []}},
          toPlace: {
            quay: {
              id: 'q2',
              tariffZones: [{id: 'zone-a'}],
            },
          },
        } as unknown as ReturnType<typeof makeLeg>,
      ],
      300,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone A']);
    expect(result.zoneCount).toBe(1);
  });

  it('should handle quay with undefined tariffZones', () => {
    const tripPattern = makeTripPattern(
      [
        {
          mode: Mode.Bus,
          fromPlace: {quay: {id: 'q1', tariffZones: undefined}},
          toPlace: {
            quay: {
              id: 'q2',
              tariffZones: [{id: 'zone-b'}],
            },
          },
        } as unknown as ReturnType<typeof makeLeg>,
      ],
      300,
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.zones).toEqual(['Zone B']);
    expect(result.zoneCount).toBe(1);
  });

  it('should handle trip with expectedStartTime in the future', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-b']},
        ),
      ],
      300,
      new Date(NOW + 2 * ONE_HOUR_MS), // two hours from now
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.secondsUntilStart).toBe((2 * ONE_HOUR_MS) / 1000); // two hours in seconds
  });

  it('should handle trip with expectedStartTime in the past', () => {
    const tripPattern = makeTripPattern(
      [
        makeLeg(
          Mode.Bus,
          {quayId: 'q1', tariffZoneIds: ['zone-a']},
          {quayId: 'q2', tariffZoneIds: ['zone-b']},
        ),
      ],
      300,
      new Date(NOW - ONE_HOUR_MS), // one hour ago
    );

    const result = getTripPatternAnalytics(tripPattern, fareZones, NOW);

    expect(result.secondsUntilStart).toBe(-ONE_HOUR_MS / 1000); // negative one hour in seconds
  });
});
