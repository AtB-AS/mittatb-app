import {computeAimedStartEndTimes} from '../utils';
import {TripPattern, Leg} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {addSeconds} from 'date-fns';

/**
 * Adds seconds to a date string and returns in Entur format (ISO 8601)
 */
function addSecondsToDateString(dateString: string, seconds: number): string {
  return addSeconds(new Date(dateString), seconds).toISOString();
}

/**
 * Creates a leg with proper aimed and expected times.
 *
 * For foot legs (mode === Mode.Foot):
 * - The Entur API aimedStartTime === expectedStartTime
 *
 * For quay legs:
 * - aimedStartTime is set from the parameter
 * - expectedStartTime has a random offset applied (-20 to +120 seconds)
 */
function makeLeg(mode: Mode, aimedStartTime: string, duration: number): Leg {
  const hasQuay = mode !== Mode.Foot;
  const aimedEndTime = addSecondsToDateString(aimedStartTime, duration);

  let expectedStartTime: string;
  let expectedEndTime: string;

  if (hasQuay) {
    const realtimeOffset = Math.floor(Math.random() * 141) - 20; // -20 to +120 seconds
    expectedStartTime = addSecondsToDateString(aimedStartTime, realtimeOffset);
    expectedEndTime = addSecondsToDateString(aimedEndTime, realtimeOffset);
  } else {
    // Foot legs: Entur API returns aimed === expected
    expectedStartTime = aimedStartTime;
    expectedEndTime = aimedEndTime;
  }

  return {
    mode,
    aimedStartTime,
    aimedEndTime,
    expectedStartTime,
    expectedEndTime,
    duration,
    distance: 1000,
    fromPlace: {
      quay: hasQuay
        ? {
            id: 'quay-1',
            name: 'Test Quay',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'stop-1',
              name: 'Test Stop',
            },
          }
        : undefined,
      longitude: 0.0,
      latitude: 0.0,
    },
    toPlace: {
      quay: hasQuay
        ? {
            id: 'quay-2',
            name: 'Test Quay 2',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'stop-2',
              name: 'Test Stop 2',
            },
          }
        : undefined,
      longitude: 0.0,
      latitude: 0.0,
    },
    serviceJourney: hasQuay
      ? {
          id: 'service-1',
          notices: [],
        }
      : undefined,
    realtime: false,
    situations: [],
    intermediateEstimatedCalls: [],
    serviceJourneyEstimatedCalls: [],
  } as Leg;
}

function makeTripPattern(legs: Leg[]): TripPattern {
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  return {
    legs,
    expectedStartTime: firstLeg.expectedStartTime,
    expectedEndTime: lastLeg.expectedEndTime,
    duration: legs.reduce((sum, leg) => sum + leg.duration, 0),
  } as TripPattern;
}

describe('computeAimedStartEndTimes', () => {
  describe('when all legs have quays', () => {
    it('should return aimed times from first and last legs', () => {
      const firstLeg = makeLeg(Mode.Bus, '2024-01-01T10:00:00Z', 600);
      const secondLeg = makeLeg(Mode.Bus, '2024-01-01T10:15:00Z', 600);
      const tripPattern = makeTripPattern([firstLeg, secondLeg]);

      const result = computeAimedStartEndTimes(tripPattern);

      expect(result.aimedStartTime).toBe(firstLeg.aimedStartTime);
      expect(result.aimedEndTime).toBe(secondLeg.aimedEndTime);
    });

    it('should work with a single leg with quay', () => {
      const leg = makeLeg(Mode.Bus, '2024-01-01T10:00:00Z', 1800);
      const tripPattern = makeTripPattern([leg]);

      const result = computeAimedStartEndTimes(tripPattern);

      expect(result.aimedStartTime).toBe(leg.aimedStartTime);
      expect(result.aimedEndTime).toBe(leg.aimedEndTime);
    });
  });

  describe('when first leg is a foot leg without quay', () => {
    it('should compute aimed start time by subtracting duration from first leg with quay', () => {
      const busAimedStart = '2024-01-01T10:05:00Z';
      const walkDuration = 347;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, 900);

      // foot legs' aimed/expected times are both set to busExpectedStart - walkDuration
      const footLegStart = addSecondsToDateString(
        busLeg.expectedStartTime,
        -walkDuration,
      );
      const footLeg = makeLeg(Mode.Foot, footLegStart, walkDuration);

      const tripPattern = makeTripPattern([footLeg, busLeg]);

      const result = computeAimedStartEndTimes(tripPattern);

      // Should compute correct aimed start: busAimedStart - walkDuration
      // NOT busExpectedStart - walkDuration (which is what the foot leg has)
      expect(result.aimedStartTime).toEqual(
        new Date(addSecondsToDateString(busAimedStart, -walkDuration)),
      );
      expect(result.aimedEndTime).toBe(busLeg.aimedEndTime);
    });

    it('should handle multiple foot legs before first quay leg', () => {
      const busAimedStart = '2024-01-01T10:00:00Z';
      const walk1Duration = 272;
      const walk2Duration = 333;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, 1200);

      const walk2Start = addSecondsToDateString(
        busLeg.expectedStartTime,
        -walk2Duration,
      );
      const walk1Start = addSecondsToDateString(walk2Start, -walk1Duration);

      const footLeg1 = makeLeg(Mode.Foot, walk1Start, walk1Duration);
      const footLeg2 = makeLeg(Mode.Foot, walk2Start, walk2Duration);

      const tripPattern = makeTripPattern([footLeg1, footLeg2, busLeg]);

      const result = computeAimedStartEndTimes(tripPattern);

      // Should compute correct aimed start: busAimedStart - (walk1 + walk2)
      expect(result.aimedStartTime).toEqual(
        new Date(
          addSecondsToDateString(
            busAimedStart,
            -(walk1Duration + walk2Duration),
          ),
        ),
      );
      expect(result.aimedEndTime).toBe(busLeg.aimedEndTime);
    });
  });

  describe('when last leg is a foot leg without quay', () => {
    it('should compute aimed end time by adding duration to last leg with quay', () => {
      const busAimedStart = '2024-01-01T10:00:00Z';
      const busDuration = 1200;
      const busAimedEnd = addSecondsToDateString(busAimedStart, busDuration);
      const walkDuration = 327;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, busDuration);

      const footLegStart = busLeg.expectedEndTime;
      const footLeg = makeLeg(Mode.Foot, footLegStart, walkDuration);

      const tripPattern = makeTripPattern([busLeg, footLeg]);

      const result = computeAimedStartEndTimes(tripPattern);

      expect(result.aimedStartTime).toBe(busAimedStart);
      // Should compute correct aimed end: busAimedEnd + walkDuration
      // NOT busExpectedEnd + walkDuration (which is what the foot leg has)
      expect(result.aimedEndTime).toEqual(
        new Date(addSecondsToDateString(busAimedEnd, walkDuration)),
      );
    });

    it('should handle multiple foot legs after last quay leg', () => {
      const busAimedStart = '2024-01-01T10:00:00Z';
      const busDuration = 1200;
      const busAimedEnd = addSecondsToDateString(busAimedStart, busDuration);
      const walk1Duration = 203;
      const walk2Duration = 405;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, busDuration);

      const walk1Start = busLeg.expectedEndTime;
      const walk2Start = addSecondsToDateString(walk1Start, walk1Duration);

      const footLeg1 = makeLeg(Mode.Foot, walk1Start, walk1Duration);
      const footLeg2 = makeLeg(Mode.Foot, walk2Start, walk2Duration);

      const tripPattern = makeTripPattern([busLeg, footLeg1, footLeg2]);

      const result = computeAimedStartEndTimes(tripPattern);

      expect(result.aimedStartTime).toBe(busAimedStart);
      // Should compute correct aimed end: busAimedEnd + walk1 + walk2
      expect(result.aimedEndTime).toEqual(
        new Date(
          addSecondsToDateString(busAimedEnd, walk1Duration + walk2Duration),
        ),
      );
    });
  });

  describe('when both first and last legs are foot legs', () => {
    it('should compute both aimed start and end times', () => {
      const busAimedStart = '2024-01-01T10:00:00Z';
      const busDuration = 1200;
      const busAimedEnd = addSecondsToDateString(busAimedStart, busDuration);
      const walk1Duration = 277;
      const walk2Duration = 273;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, busDuration);

      const footLeg1Start = addSecondsToDateString(
        busLeg.expectedStartTime,
        -walk1Duration,
      );
      const footLeg2Start = busLeg.expectedEndTime;

      const footLeg1 = makeLeg(Mode.Foot, footLeg1Start, walk1Duration);
      const footLeg2 = makeLeg(Mode.Foot, footLeg2Start, walk2Duration);

      const tripPattern = makeTripPattern([footLeg1, busLeg, footLeg2]);

      const result = computeAimedStartEndTimes(tripPattern);

      // Should compute: busAimedStart - walk1Duration
      expect(result.aimedStartTime).toEqual(
        new Date(addSecondsToDateString(busAimedStart, -walk1Duration)),
      );
      // Should compute: busAimedEnd + walk2Duration
      expect(result.aimedEndTime).toEqual(
        new Date(addSecondsToDateString(busAimedEnd, walk2Duration)),
      );
    });

    it('should handle complex trip with multiple foot legs at both ends', () => {
      const busAimedStart = '2024-01-01T09:55:00Z';
      const tramAimedStart = '2024-01-01T10:15:00Z';
      const tramDuration = 900;
      const tramAimedEnd = addSecondsToDateString(tramAimedStart, tramDuration);
      const walk1Duration = 226;
      const walk2Duration = 448;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, 900);
      const tramLeg = makeLeg(Mode.Tram, tramAimedStart, tramDuration);

      const footLeg1Start = addSecondsToDateString(
        busLeg.expectedStartTime,
        -walk1Duration,
      );
      const footLeg2Start = tramLeg.expectedEndTime;

      const footLeg1 = makeLeg(Mode.Foot, footLeg1Start, walk1Duration);
      const footLeg2 = makeLeg(Mode.Foot, footLeg2Start, walk2Duration);

      const tripPattern = makeTripPattern([
        footLeg1,
        busLeg,
        tramLeg,
        footLeg2,
      ]);

      const result = computeAimedStartEndTimes(tripPattern);

      // Should compute: busAimedStart - walk1Duration
      expect(result.aimedStartTime).toEqual(
        new Date(addSecondsToDateString(busAimedStart, -walk1Duration)),
      );
      // Should compute: tramAimedEnd + walk2Duration
      expect(result.aimedEndTime).toEqual(
        new Date(addSecondsToDateString(tramAimedEnd, walk2Duration)),
      );
    });
  });

  describe('edge cases', () => {
    it('should handle trip with only foot legs by returning original times', () => {
      const walkStart = '2024-01-01T10:00:00Z';
      const walkDuration = 1477;

      const tripPattern = makeTripPattern([
        makeLeg(Mode.Foot, walkStart, walkDuration),
      ]);

      const result = computeAimedStartEndTimes(tripPattern);

      // When there are no legs with quays, return the original aimed times
      expect(result.aimedStartTime).toBe(walkStart);
      expect(result.aimedEndTime).toBe(
        addSecondsToDateString(walkStart, walkDuration),
      );
    });

    it('should handle trip with multiple foot legs and no quays', () => {
      const walk1Start = '2024-01-01T10:00:00Z';
      const walk1Duration = 502;
      const walk2Start = addSecondsToDateString(walk1Start, walk1Duration);
      const walk2Duration = 1176;

      const tripPattern = makeTripPattern([
        makeLeg(Mode.Foot, walk1Start, walk1Duration),
        makeLeg(Mode.Foot, walk2Start, walk2Duration),
      ]);

      const result = computeAimedStartEndTimes(tripPattern);

      // When there are no legs with quays, return the original aimed times from first and last legs
      expect(result.aimedStartTime).toBe(walk1Start);
      expect(result.aimedEndTime).toBe(
        addSecondsToDateString(walk2Start, walk2Duration),
      );
    });

    it('should handle trip with foot leg in the middle', () => {
      const busAimedStart = '2024-01-01T10:00:00Z';
      const busDuration = 900;
      const tramAimedStart = '2024-01-01T10:20:00Z';
      const tramDuration = 900;
      const walkDuration = 132;

      const busLeg = makeLeg(Mode.Bus, busAimedStart, busDuration);
      const tramLeg = makeLeg(Mode.Tram, tramAimedStart, tramDuration);

      const footLegStart = busLeg.expectedEndTime;
      const footLeg = makeLeg(Mode.Foot, footLegStart, walkDuration);

      const tripPattern = makeTripPattern([busLeg, footLeg, tramLeg]);

      const result = computeAimedStartEndTimes(tripPattern);

      // Should not be affected by middle foot leg
      expect(result.aimedStartTime).toBe(busAimedStart);
      expect(result.aimedEndTime).toBe(
        addSecondsToDateString(tramAimedStart, tramDuration),
      );
    });

    it('should handle trip without any foot legs', () => {
      const tripPattern = makeTripPattern([
        makeLeg(Mode.Bus, '2024-01-01T10:00:00Z', 900),
        makeLeg(Mode.Tram, '2024-01-01T10:20:00Z', 900),
      ]);

      const result = computeAimedStartEndTimes(tripPattern);

      // Should return original aimed times
      expect(result.aimedStartTime).toBe('2024-01-01T10:00:00Z');
      expect(result.aimedEndTime).toBe(
        addSecondsToDateString('2024-01-01T10:20:00Z', 900),
      );
    });
  });
});
