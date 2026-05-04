import {
  findAllNoticesFromLeg,
  findAllNotices,
  findAllSituationsFromLeg,
  findAllSituations,
  getSituationSummary,
  getMessageTypeForSituation,
  getMsgTypeForMostCriticalSituationOrNotice,
  toMostCriticalStatus,
  getMsgTypeForLeg,
  isSituationValidAtDate,
  getSituationOrNoticeA11yLabel,
} from '../utils';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {Leg} from '@atb/api/types/trips';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {
  ReportType,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Language} from '@atb/translations';

// --- Helpers to build test fixtures ---

const makeNotice = (id: string, text?: string): NoticeFragment => ({id, text});

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

const makeMinimalLeg = (overrides: Partial<Leg> = {}): Leg =>
  ({
    mode: 'bus',
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

const makeTripPattern = (
  legs: Leg[],
  expectedStartTime: string = '2024-06-15T10:00:00Z',
): TripPatternFragment =>
  ({
    legs,
    expectedStartTime,
  }) as unknown as TripPatternFragment;

// --- Tests ---

describe('findAllNoticesFromLeg', () => {
  it('should return empty array for leg with no estimated calls', () => {
    const leg = makeMinimalLeg();
    expect(findAllNoticesFromLeg(leg)).toEqual([]);
  });

  it('should collect notices from fromEstimatedCall', () => {
    const leg = makeMinimalLeg({
      fromEstimatedCall: {
        notices: [makeNotice('n1', 'Notice 1')],
      },
    } as Partial<Leg>);
    expect(findAllNoticesFromLeg(leg)).toEqual([{id: 'n1', text: 'Notice 1'}]);
  });

  it('should collect notices from toEstimatedCall', () => {
    const leg = makeMinimalLeg({
      toEstimatedCall: {
        notices: [makeNotice('n2', 'Notice 2')],
      },
    } as Partial<Leg>);
    expect(findAllNoticesFromLeg(leg)).toEqual([{id: 'n2', text: 'Notice 2'}]);
  });

  it('should collect notices from both estimated calls', () => {
    const leg = makeMinimalLeg({
      fromEstimatedCall: {notices: [makeNotice('n1', 'From notice')]},
      toEstimatedCall: {notices: [makeNotice('n2', 'To notice')]},
    } as Partial<Leg>);
    expect(findAllNoticesFromLeg(leg)).toHaveLength(2);
  });

  it('should filter out notices without id', () => {
    const leg = makeMinimalLeg({
      fromEstimatedCall: {
        notices: [makeNotice('', 'No ID notice')],
      },
    } as Partial<Leg>);
    expect(findAllNoticesFromLeg(leg)).toEqual([]);
  });

  it('should filter out notices without text', () => {
    const leg = makeMinimalLeg({
      fromEstimatedCall: {
        notices: [makeNotice('n1', undefined), makeNotice('n2', '')],
      },
    } as Partial<Leg>);
    expect(findAllNoticesFromLeg(leg)).toEqual([]);
  });
});

describe('findAllNotices', () => {
  it('should return empty array for trip pattern with no notices', () => {
    const tp = makeTripPattern([makeMinimalLeg()]);
    expect(findAllNotices(tp)).toEqual([]);
  });

  it('should deduplicate notices by id', () => {
    const tp = makeTripPattern([
      makeMinimalLeg({
        fromEstimatedCall: {notices: [makeNotice('n1', 'Same notice')]},
      } as Partial<Leg>),
      makeMinimalLeg({
        fromEstimatedCall: {notices: [makeNotice('n1', 'Same notice')]},
      } as Partial<Leg>),
    ]);
    expect(findAllNotices(tp)).toHaveLength(1);
  });

  it('should keep notices with different ids', () => {
    const tp = makeTripPattern([
      makeMinimalLeg({
        fromEstimatedCall: {notices: [makeNotice('n1', 'Notice 1')]},
      } as Partial<Leg>),
      makeMinimalLeg({
        fromEstimatedCall: {notices: [makeNotice('n2', 'Notice 2')]},
      } as Partial<Leg>),
    ]);
    expect(findAllNotices(tp)).toHaveLength(2);
  });
});

describe('findAllSituationsFromLeg', () => {
  it('should return empty array for leg with no situations', () => {
    const leg = makeMinimalLeg();
    expect(findAllSituationsFromLeg(leg)).toEqual([]);
  });

  it('should collect situations from leg.situations', () => {
    const sit = makeSituation({id: 's1'});
    const leg = makeMinimalLeg({situations: [sit]} as Partial<Leg>);
    expect(findAllSituationsFromLeg(leg)).toEqual([sit]);
  });

  it('should collect situations from fromEstimatedCall', () => {
    const sit = makeSituation({id: 's2'});
    const leg = makeMinimalLeg({
      fromEstimatedCall: {situations: [sit]},
    } as Partial<Leg>);
    expect(findAllSituationsFromLeg(leg)).toEqual([sit]);
  });

  it('should collect situations from toEstimatedCall', () => {
    const sit = makeSituation({id: 's3'});
    const leg = makeMinimalLeg({
      toEstimatedCall: {situations: [sit]},
    } as Partial<Leg>);
    expect(findAllSituationsFromLeg(leg)).toEqual([sit]);
  });

  it('should collect situations from all sources', () => {
    const s1 = makeSituation({id: 's1'});
    const s2 = makeSituation({id: 's2'});
    const s3 = makeSituation({id: 's3'});
    const leg = makeMinimalLeg({
      situations: [s1],
      fromEstimatedCall: {situations: [s2]},
      toEstimatedCall: {situations: [s3]},
    } as Partial<Leg>);
    expect(findAllSituationsFromLeg(leg)).toHaveLength(3);
  });
});

describe('findAllSituations', () => {
  it('should deduplicate situations by id', () => {
    const sit = makeSituation({
      id: 's1',
      validityPeriod: {
        startTime: '2024-06-15T08:00:00Z',
        endTime: '2024-06-15T12:00:00Z',
      },
    });
    const tp = makeTripPattern(
      [
        makeMinimalLeg({situations: [sit]} as Partial<Leg>),
        makeMinimalLeg({
          fromPlace: {quay: {situations: [sit]}},
        } as Partial<Leg>),
      ],
      '2024-06-15T10:00:00Z',
    );
    expect(findAllSituations(tp)).toHaveLength(1);
  });
});

describe('getSituationSummary', () => {
  it('should return summary text for matching language', () => {
    const sit = makeSituation({
      summary: [{language: 'nob', value: 'Norsk oppsummering'}],
    });
    expect(getSituationSummary(sit, Language.Norwegian)).toBe(
      'Norsk oppsummering',
    );
  });

  it('should fall back to description when no summary', () => {
    const sit = makeSituation({
      summary: [],
      description: [{language: 'eng', value: 'English description'}],
    });
    expect(getSituationSummary(sit, Language.English)).toBe(
      'English description',
    );
  });

  it('should return undefined when neither summary nor description', () => {
    const sit = makeSituation({summary: [], description: []});
    expect(getSituationSummary(sit, Language.Norwegian)).toBeUndefined();
  });
});

describe('getMessageTypeForSituation', () => {
  it('should return warning for incident report type', () => {
    const sit = makeSituation({reportType: ReportType.Incident});
    expect(getMessageTypeForSituation(sit)).toBe('warning');
  });

  it('should return info for general report type', () => {
    const sit = makeSituation({reportType: ReportType.General});
    expect(getMessageTypeForSituation(sit)).toBe('info');
  });

  it('should return info for undefined report type', () => {
    const sit = makeSituation({reportType: undefined});
    expect(getMessageTypeForSituation(sit)).toBe('info');
  });
});

describe('toMostCriticalStatus', () => {
  it('should return msgType when currentlyMostCritical is undefined', () => {
    expect(toMostCriticalStatus(undefined, 'warning')).toBe('warning');
  });

  it('should return currentlyMostCritical when msgType is undefined', () => {
    expect(toMostCriticalStatus('warning', undefined)).toBe('warning');
  });

  it('should return the more critical of two statuses', () => {
    expect(toMostCriticalStatus('info', 'warning')).toBe('warning');
    expect(toMostCriticalStatus('warning', 'info')).toBe('warning');
    expect(toMostCriticalStatus('warning', 'error')).toBe('error');
    expect(toMostCriticalStatus('error', 'warning')).toBe('error');
  });

  it('should return either when both are the same', () => {
    expect(toMostCriticalStatus('info', 'info')).toBe('info');
    expect(toMostCriticalStatus('warning', 'warning')).toBe('warning');
  });
});

describe('getMsgTypeForMostCriticalSituationOrNotice', () => {
  it('should return error when cancellation is true', () => {
    expect(getMsgTypeForMostCriticalSituationOrNotice([], [], true)).toBe(
      'error',
    );
  });

  it('should return undefined for no situations and no notices', () => {
    expect(getMsgTypeForMostCriticalSituationOrNotice([], [])).toBeUndefined();
  });

  it('should return info when only notices are present', () => {
    expect(
      getMsgTypeForMostCriticalSituationOrNotice([], [makeNotice('n1', 'Hi')]),
    ).toBe('info');
  });

  it('should return info for general situations', () => {
    expect(
      getMsgTypeForMostCriticalSituationOrNotice([
        makeSituation({reportType: ReportType.General}),
      ]),
    ).toBe('info');
  });

  it('should return warning for incident situations', () => {
    expect(
      getMsgTypeForMostCriticalSituationOrNotice([
        makeSituation({reportType: ReportType.Incident}),
      ]),
    ).toBe('warning');
  });

  it('should return warning when mixed general and incident', () => {
    expect(
      getMsgTypeForMostCriticalSituationOrNotice([
        makeSituation({id: 's1', reportType: ReportType.General}),
        makeSituation({id: 's2', reportType: ReportType.Incident}),
      ]),
    ).toBe('warning');
  });
});

describe('getMsgTypeForLeg', () => {
  it('should return undefined for a leg with nothing notable', () => {
    expect(getMsgTypeForLeg(makeMinimalLeg())).toBeUndefined();
  });

  it('should return warning for RailReplacementBus', () => {
    const leg = makeMinimalLeg({
      transportSubmode: TransportSubmode.RailReplacementBus,
    } as Partial<Leg>);
    expect(getMsgTypeForLeg(leg)).toBe('warning');
  });

  it('should return warning for legs with booking arrangements', () => {
    const leg = makeMinimalLeg({
      bookingArrangements: {latestBookingTime: '2024-06-15T09:00:00Z'},
    } as Partial<Leg>);
    expect(getMsgTypeForLeg(leg)).toBe('warning');
  });

  it('should return info for legs with only notices', () => {
    const leg = makeMinimalLeg({
      fromEstimatedCall: {notices: [makeNotice('n1', 'Some notice')]},
    } as Partial<Leg>);
    expect(getMsgTypeForLeg(leg)).toBe('info');
  });

  it('should return warning when combining info notices with RailReplacementBus', () => {
    const leg = makeMinimalLeg({
      transportSubmode: TransportSubmode.RailReplacementBus,
      fromEstimatedCall: {notices: [makeNotice('n1', 'Notice')]},
    } as Partial<Leg>);
    expect(getMsgTypeForLeg(leg)).toBe('warning');
  });
});

describe('isSituationValidAtDate', () => {
  it('should return true when date is within validity period', () => {
    const sit = makeSituation({
      validityPeriod: {
        startTime: '2024-06-15T08:00:00Z',
        endTime: '2024-06-15T12:00:00Z',
      },
    });
    expect(isSituationValidAtDate('2024-06-15T10:00:00Z')(sit)).toBe(true);
  });

  it('should return false when date is after validity period', () => {
    const sit = makeSituation({
      validityPeriod: {
        startTime: '2024-06-15T08:00:00Z',
        endTime: '2024-06-15T09:00:00Z',
      },
    });
    expect(isSituationValidAtDate('2024-06-15T10:00:00Z')(sit)).toBe(false);
  });

  it('should return false when date is before validity period', () => {
    const sit = makeSituation({
      validityPeriod: {
        startTime: '2024-06-15T11:00:00Z',
        endTime: '2024-06-15T12:00:00Z',
      },
    });
    expect(isSituationValidAtDate('2024-06-15T10:00:00Z')(sit)).toBe(false);
  });

  it('should check only after startTime when no endTime', () => {
    const sit = makeSituation({
      validityPeriod: {startTime: '2024-06-15T08:00:00Z'},
    });
    expect(isSituationValidAtDate('2024-06-15T10:00:00Z')(sit)).toBe(true);
    expect(isSituationValidAtDate('2024-06-15T07:00:00Z')(sit)).toBe(false);
  });

  it('should check only before endTime when no startTime', () => {
    const sit = makeSituation({
      validityPeriod: {endTime: '2024-06-15T12:00:00Z'},
    });
    expect(isSituationValidAtDate('2024-06-15T10:00:00Z')(sit)).toBe(true);
    expect(isSituationValidAtDate('2024-06-15T13:00:00Z')(sit)).toBe(false);
  });

  it('should return true when no validity period at all', () => {
    const sit = makeSituation({validityPeriod: undefined});
    expect(isSituationValidAtDate('2024-06-15T10:00:00Z')(sit)).toBe(true);
  });
});

describe('getSituationOrNoticeA11yLabel', () => {
  const t = (input: any) => {
    if (typeof input === 'string') return input;
    if (typeof input === 'object' && input !== null) {
      // Return the Norwegian value or first available
      return input[0] ?? input.nob ?? input.eng ?? String(input);
    }
    return String(input);
  };

  it('should return error label for cancellation', () => {
    const result = getSituationOrNoticeA11yLabel([], [], true, t);
    expect(result).toBeDefined();
  });

  it('should return undefined for no situations and no notices', () => {
    expect(getSituationOrNoticeA11yLabel([], [], false, t)).toBeUndefined();
  });

  it('should return info label when only notices', () => {
    const result = getSituationOrNoticeA11yLabel(
      [],
      [makeNotice('n1', 'Notice')],
      false,
      t,
    );
    expect(result).toBeDefined();
  });

  it('should return warning label when incident situation present', () => {
    const result = getSituationOrNoticeA11yLabel(
      [makeSituation({reportType: ReportType.Incident})],
      [],
      false,
      t,
    );
    expect(result).toBeDefined();
  });
});
