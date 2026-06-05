import {Leg} from '@atb/api/types/trips';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {
  ReportType,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {getMsgTypeForTravelCardLeg} from '../utils';

jest.mock('@atb/screen-components/travel-details-screens', () => ({
  getTripPatternBookingStatus: (...args: unknown[]) =>
    require('@atb/screen-components/travel-details-screens/utils').getTripPatternBookingStatus(
      ...args,
    ),
}));

const baseTime = new Date('2026-06-03T12:00:00Z');
const atSeconds = (seconds: number) =>
  new Date(baseTime.getTime() + seconds * 1000).toISOString();

const makeSituation = (
  overrides: Partial<SituationFragment> = {},
): SituationFragment => ({
  id: overrides.id ?? 'sit-1',
  summary: overrides.summary ?? [],
  description: overrides.description ?? [],
  advice: overrides.advice ?? [],
  reportType: overrides.reportType ?? ReportType.General,
  validityPeriod: overrides.validityPeriod,
  situationNumber: overrides.situationNumber,
  infoLinks: overrides.infoLinks,
});

const makeLeg = (overrides: Partial<Leg> = {}): Leg =>
  ({
    mode: 'bus',
    expectedStartTime: atSeconds(0),
    expectedEndTime: atSeconds(600),
    fromPlace: {quay: null},
    toPlace: {quay: null},
    fromEstimatedCall: null,
    toEstimatedCall: null,
    situations: [],
    bookingArrangements: null,
    transportSubmode: null,
    line: null,
    ...overrides,
  }) as unknown as Leg;

/** A pair of transit legs with the given wait time (in seconds) between them. */
const makeLegPair = (
  waitTimeInSeconds: number,
  secondLegOverrides: Partial<Leg> = {},
): Leg[] => [
  makeLeg({expectedStartTime: atSeconds(0), expectedEndTime: atSeconds(600)}),
  makeLeg({
    expectedStartTime: atSeconds(600 + waitTimeInSeconds),
    expectedEndTime: atSeconds(1200 + waitTimeInSeconds),
    ...secondLegOverrides,
  }),
];

describe('getMsgTypeForTravelCardLeg', () => {
  describe('leg-specific notifications', () => {
    it('returns undefined for a leg without notifications', () => {
      expect(getMsgTypeForTravelCardLeg([makeLeg()], 0)).toBeUndefined();
    });

    it('returns warning for a leg with an incident situation', () => {
      const leg = makeLeg({
        situations: [makeSituation({reportType: ReportType.Incident})],
      });
      expect(getMsgTypeForTravelCardLeg([leg], 0)).toBe('warning');
    });

    it('returns info for a leg with a general situation', () => {
      const leg = makeLeg({
        situations: [makeSituation({reportType: ReportType.General})],
      });
      expect(getMsgTypeForTravelCardLeg([leg], 0)).toBe('info');
    });

    it('returns info for a leg with a notice', () => {
      const leg = makeLeg({
        fromEstimatedCall: {
          aimedDepartureTime: atSeconds(0),
          expectedDepartureTime: atSeconds(0),
          stopPositionInPattern: 0,
          cancellation: false,
          quay: {name: 'A'},
          notices: [{id: 'notice-1', text: 'Some notice'}],
          situations: [],
        },
      });
      expect(getMsgTypeForTravelCardLeg([leg], 0)).toBe('info');
    });

    it('returns warning for a rail replacement bus leg', () => {
      const leg = makeLeg({
        transportSubmode: TransportSubmode.RailReplacementBus,
      });
      expect(getMsgTypeForTravelCardLeg([leg], 0)).toBe('warning');
    });

    it('returns warning for a leg with booking arrangements', () => {
      const leg = makeLeg({bookingArrangements: {}} as Partial<Leg>);
      expect(getMsgTypeForTravelCardLeg([leg], 0)).toBe('warning');
    });
  });

  describe('short transfer time', () => {
    it('returns info for a short wait time from the previous leg', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(120), 1)).toBe('info');
    });

    it('returns undefined for an insignificant wait time (30s or less)', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(30), 1)).toBeUndefined();
    });

    it('returns info just above the insignificant wait time limit', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(31), 1)).toBe('info');
    });

    it('returns info at the short transfer time limit (180s)', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(180), 1)).toBe('info');
    });

    it('returns undefined just above the short transfer time limit', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(181), 1)).toBeUndefined();
    });

    it('returns undefined for a negative wait time', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(-60), 1)).toBeUndefined();
    });

    it('returns undefined for the first leg regardless of times', () => {
      expect(getMsgTypeForTravelCardLeg(makeLegPair(120), 0)).toBeUndefined();
    });
  });

  describe('foot legs', () => {
    it('returns undefined for a foot leg even with short wait from the previous leg', () => {
      const legs = makeLegPair(120, {mode: 'foot'} as Partial<Leg>);
      expect(getMsgTypeForTravelCardLeg(legs, 1)).toBeUndefined();
    });

    it('returns the leg-specific notification for a foot leg', () => {
      const legs = makeLegPair(120, {
        mode: 'foot',
        situations: [makeSituation({reportType: ReportType.Incident})],
      } as Partial<Leg>);
      expect(getMsgTypeForTravelCardLeg(legs, 1)).toBe('warning');
    });
  });

  describe('combined notifications', () => {
    it('returns the most critical when combining short wait (info) with an incident (warning)', () => {
      const legs = makeLegPair(120, {
        situations: [makeSituation({reportType: ReportType.Incident})],
      });
      expect(getMsgTypeForTravelCardLeg(legs, 1)).toBe('warning');
    });

    it('returns info when combining short wait with a general situation', () => {
      const legs = makeLegPair(120, {
        situations: [makeSituation({reportType: ReportType.General})],
      });
      expect(getMsgTypeForTravelCardLeg(legs, 1)).toBe('info');
    });
  });
});
