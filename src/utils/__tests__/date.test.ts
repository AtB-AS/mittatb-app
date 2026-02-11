// import {Language} from '@atb/translations';
// import {formatLocaleTime} from '../date';

import {Language} from '@atb/translations';
import timeMocker from 'timezone-mock';
import {
  convertIsoStringFieldsToDate,
  dateWithReplacedTime,
  formatLocaleTime,
  formatToLongDateTime,
  getTimeBetweenFormatted,
  isAfter,
  isBefore,
  isBetween,
  isEqualOrAfter,
  secondsToDuration,
} from '../date'; // Adjust the path if needed

type TimeZone =
  | 'US/Pacific'
  | 'US/Eastern'
  | 'Brazil/East'
  | 'UTC'
  | 'Europe/London'
  | 'Australia/Adelaide';

describe.each<TimeZone>([
  'US/Pacific',
  'US/Eastern',
  'Brazil/East',
  'UTC',
  'Europe/London',
  'Australia/Adelaide',
])('date utils (should be in CET even if %s)', (timeZone: TimeZone) => {
  beforeAll(() => {
    timeMocker.register(timeZone);
  });
  afterAll(() => {
    timeMocker.unregister();
  });

  describe('dateWithReplacedTime', () => {
    test.each([
      ['2024-09-01T12:00:00Z', '14:00', '2024-09-01T12:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '15:00', '2024-09-01T13:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '16:00', '2024-09-01T14:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '17:00', '2024-09-01T15:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '18:00', '2024-09-01T16:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '19:00', '2024-09-01T17:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '20:00', '2024-09-01T18:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '21:00', '2024-09-01T19:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '22:00', '2024-09-01T20:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '23:00', '2024-09-01T21:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '23:59', '2024-09-01T21:59:00.000Z'],
      ['2024-09-01T12:00:00Z', '05:00', '2024-09-01T03:00:00.000Z'],
      ['2024-09-01T12:00:00Z', '02:00', '2024-09-01T00:00:00.000Z'],
      ['2024-09-01T15:00:00Z', '17:00', '2024-09-01T15:00:00.000Z'],
      // Back in time
      ['2024-09-01T12:00:00Z', '01:00', '2024-08-31T23:00:00.000Z'],
    ])(
      'should replace time enforced to CET (%s -> %s)',
      (date, time, expected) => {
        const result = dateWithReplacedTime(date, time);
        expect(result.toISOString()).toBe(expected);
      },
    );
  });

  describe('formatLocaleTime', () => {
    test('should not compensate if ignoreTimeZone: true', () => {
      const now = '2024-09-01T12:00:00Z';
      const formatted = formatLocaleTime(now, Language.Norwegian, {
        ignoreTimeZone: true,
      });

      const expected = timeZoneMapper({
        'US/Pacific': () => '05:00',
        'US/Eastern': () => '08:00',
        'Brazil/East': () => '09:00',
        UTC: () => '12:00',
        'Europe/London': () => '13:00',
        'Australia/Adelaide': () => '21:30',
      })(timeZone);

      expect(formatted).toBe(expected);
    });

    test('should always show CET by default', () => {
      const now = '2024-09-01T12:00:00Z';
      const formatted = formatLocaleTime(now, Language.Norwegian);
      expect(formatted).toBe('14:00');
    });
  });

  describe('formatToLongDateTime', () => {
    const currentYear = new Date().getFullYear();
    test('for norwegian (bokmål) format, current year', () => {
      expect(
        formatToLongDateTime(
          `${currentYear}-09-01T12:00:00Z`,
          Language.Norwegian,
        ),
      ).toBe('01. sep. 14:00');
    });

    test('for english format, current year', () => {
      expect(
        formatToLongDateTime(
          `${currentYear}-09-01T12:00:00Z`,
          Language.English,
        ),
      ).toBe('01. Sep 14:00');
    });

    test('for norwegian (bokmål) format, not current year', () => {
      expect(
        formatToLongDateTime(`2020-09-01T12:00:00Z`, Language.Norwegian),
      ).toBe('01. sep. 2020, 14:00');
    });

    test('for english format, not current year', () => {
      expect(
        formatToLongDateTime(`2020-09-01T12:00:00Z`, Language.English),
      ).toBe('01. Sep 2020, 14:00');
    });
  });
});

describe('getTimeBetweenFormatted', () => {
  // format in hh:mm:ss over 60min and mm:ss under 60 min
  test('For a few hours', () => {
    const startTime = new Date('2024-09-01T12:00:00Z');
    const endTime = new Date('2024-09-01T14:00:00Z');
    expect(getTimeBetweenFormatted(startTime, endTime)).toBe('02:00:00');
  });

  test('For tens of minutes', () => {
    const startTime = new Date('2024-09-01T12:00:00Z');
    const endTime = new Date('2024-09-01T12:24:21Z');
    expect(expect(getTimeBetweenFormatted(startTime, endTime)).toBe('24:21'));
  });

  test('For a few minutes', () => {
    const startTime = new Date('2024-09-01T12:00:00Z');
    const endTime = new Date('2024-09-01T12:04:46Z');
    expect(expect(getTimeBetweenFormatted(startTime, endTime)).toBe('04:46'));
  });

  test('For a few seconds', () => {
    const startTime = new Date('2024-09-01T12:00:00Z');
    const endTime = new Date('2024-09-01T12:00:32Z');
    expect(expect(getTimeBetweenFormatted(startTime, endTime)).toBe('00:32'));
  });

  test('For one second', () => {
    const startTime = new Date('2024-09-01T12:00:00Z');
    const endTime = new Date('2024-09-01T12:00:01Z');
    expect(expect(getTimeBetweenFormatted(startTime, endTime)).toBe('00:01'));
  });

  test('For equal start and endtime', () => {
    const startTime = new Date('2024-09-01T12:00:00Z');
    const endTime = new Date('2024-09-01T12:00:00Z');
    expect(expect(getTimeBetweenFormatted(startTime, endTime)).toBe('00:00'));
  });

  test('For negative value', () => {
    const startTime = new Date('2024-09-01T12:23:10Z');
    const endTime = new Date('2024-09-01T12:00:00Z');
    expect(expect(getTimeBetweenFormatted(startTime, endTime)).toBe('-23:10'));
  });
});

function timeZoneMapper<T>(mapper: {
  [key in TimeZone]: (timeZone: TimeZone, offset: number) => T;
}) {
  return (timeZone: TimeZone) =>
    mapper[timeZone](timeZone, timeZoneToOffset(timeZone));
}

function timeZoneToOffset(timeZone: TimeZone): number {
  switch (timeZone) {
    case 'US/Pacific':
      return -7;
    case 'US/Eastern':
      return -4;
    case 'Brazil/East':
      return -3;
    case 'UTC':
      return 0;
    case 'Europe/London':
      return 1;
    case 'Australia/Adelaide':
      return 9.5;
  }
}

describe('convertIsoStringFieldsToDate', () => {
  it('should convert ISO string date fields to Date objects', () => {
    const input = {
      createdAt: '2024-11-28T14:30:00Z',
      updatedAt: '2024-11-29T10:00:00Z',
    };
    const result = convertIsoStringFieldsToDate(input);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle nested objects and convert date fields inside them', () => {
    const input = {
      nested: {
        startDate: '2024-11-01T10:00:00Z',
        endDate: '2024-11-02T12:00:00Z',
      },
    };
    const result = convertIsoStringFieldsToDate(input);
    expect(result.nested.startDate).toBeInstanceOf(Date);
    expect(result.nested.endDate).toBeInstanceOf(Date);
  });

  it('should handle arrays containing ISO date strings', () => {
    const input = [
      {createdAt: '2024-11-28T14:30:00Z'},
      {createdAt: '2024-11-29T08:00:00Z'},
    ];
    const result = convertIsoStringFieldsToDate(input);
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[1].createdAt).toBeInstanceOf(Date);
  });

  it('should handle arrays of nested objects', () => {
    const input = [
      {nested: {startDate: '2024-11-01T10:00:00Z'}},
      {nested: {startDate: '2024-11-02T12:00:00Z'}},
    ];
    const result = convertIsoStringFieldsToDate(input);
    expect(result[0].nested.startDate).toBeInstanceOf(Date);
    expect(result[1].nested.startDate).toBeInstanceOf(Date);
  });

  it('should not alter non-date fields', () => {
    const input = {
      name: 'Entity 1',
      value: 100,
      active: true,
    };
    const result = convertIsoStringFieldsToDate(input);
    expect(result.name).toBe('Entity 1');
    expect(result.value).toBe(100);
    expect(result.active).toBe(true);
  });

  it('should handle empty objects and arrays gracefully', () => {
    const inputObject = {};
    const inputArray: any[] = [];
    expect(convertIsoStringFieldsToDate(inputObject)).toEqual({});
    expect(convertIsoStringFieldsToDate(inputArray)).toEqual([]);
  });

  it('should handle deeply nested structures with multiple date fields', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            date1: '2024-11-01T10:00:00Z',
            date2: '2024-11-02T12:00:00Z',
          },
        },
      },
    };
    const result = convertIsoStringFieldsToDate(input);
    expect(result.level1.level2.level3.date1).toBeInstanceOf(Date);
    expect(result.level1.level2.level3.date2).toBeInstanceOf(Date);
  });

  it('should handle nested structures on different levels together with non-date fields', () => {
    const input = {
      level1: {
        date1: '2024-11-01T10:00:00Z',
        active: true,
        level2: {
          date1: '2024-11-01T10:00:00Z',
          name: 'Entity 1',
          level3: {
            date1: '2024-11-01T10:00:00Z',
            date2: '2024-11-02T12:00:00Z',
            value: 100,
          },
        },
      },
    };
    const result = convertIsoStringFieldsToDate(input);
    expect(result.level1.date1).toBeInstanceOf(Date);
    expect(result.level1.active).toBe(true);
    expect(result.level1.level2.date1).toBeInstanceOf(Date);
    expect(result.level1.level2.name).toBe('Entity 1');
    expect(result.level1.level2.level3.date1).toBeInstanceOf(Date);
    expect(result.level1.level2.level3.date2).toBeInstanceOf(Date);
    expect(result.level1.level2.level3.value).toBe(100);
    expect(result.level1.level2.whatever).toBeUndefined();
  });
});

describe('secondsToDuration', () => {
  // Basic Functionality
  describe('Basic conversions', () => {
    test('converts 500 seconds to duration string in English', () => {
      const result = secondsToDuration(500, Language.English);
      expect(result).toBe('8 minutes');
    });

    test('converts 500 seconds to duration string in Norwegian', () => {
      const result = secondsToDuration(500, Language.Norwegian);
      expect(result).toBe('8 minutter');
    });
  });

  // Edge Cases
  describe('Edge case handling', () => {
    test('handles 59 seconds at low range', () => {
      const result = secondsToDuration(59, Language.English);
      expect(result).toBe('1 minute');
    });

    test('handles 60 seconds (start of minutes range)', () => {
      const result = secondsToDuration(60, Language.English);
      expect(result).toBe('1 minute');
    });

    test('handles 3658 seconds (slightly above hours range)', () => {
      const result = secondsToDuration(3658, Language.English);
      expect(result).toBe('1 hour, 1 minute');
    });

    test('handles 3600 seconds (start of hours range)', () => {
      const result = secondsToDuration(3600, Language.English);
      expect(result).toBe('1 hour');
    });
  });

  // Large Durations
  describe('Large durations', () => {
    test('handles durations greater than a day', () => {
      const result = secondsToDuration(90000, Language.English);
      expect(result).toBe('1 day, 1 hour');
    });
  });

  // Custom Options
  describe('Custom options passed to humanizeDuration', () => {
    test('applies custom options (e.g., largest units) correctly', () => {
      const result = secondsToDuration(3661, Language.English, {
        largest: 1,
      });
      expect(result).toBe('1 hour');
    });
  });

  // Invalid or Corner Case Inputs
  describe('Invalid or edge case inputs', () => {
    test('handles negative seconds gracefully', () => {
      const result = secondsToDuration(-500, Language.English);
      expect(result).toBe('0 minutes');
    });

    test('handles exactly 0 seconds', () => {
      const result = secondsToDuration(0, Language.English);
      expect(result).toBe('0 minutes');
    });
  });

  // Unit Map Logic
  describe('Unit map logic', () => {
    test('uses minutes and seconds for durations under an hour', () => {
      const result = secondsToDuration(120, Language.English);
      expect(result).toBe('2 minutes');
    });

    test('uses hours and minutes for durations under a day', () => {
      const result = secondsToDuration(7200, Language.English);
      expect(result).toBe('2 hours');
    });
  });

  describe('date comparison utilities', () => {
    const earlier = new Date('2026-02-09T00:00:00Z');
    const middle = new Date('2026-02-10T00:00:00Z');
    const later = new Date('2026-02-11T00:00:00Z');

    describe('isAfter', () => {
      test('returns true when date is after comparison date', () => {
        expect(isAfter(later, middle)).toBe(true);
      });

      test('returns false when date is before comparison date', () => {
        expect(isAfter(earlier, middle)).toBe(false);
      });

      test('returns false when dates are equal', () => {
        expect(isAfter(middle, middle)).toBe(false);
      });

      test('works with string dates', () => {
        expect(isAfter('2026-02-11', '2026-02-10')).toBe(true);
      });
    });

    describe('isBefore', () => {
      test('returns true when date is before comparison date', () => {
        expect(isBefore(earlier, middle)).toBe(true);
      });

      test('returns false when date is after comparison date', () => {
        expect(isBefore(later, middle)).toBe(false);
      });

      test('returns false when dates are equal', () => {
        expect(isBefore(middle, middle)).toBe(false);
      });

      test('works with string dates', () => {
        expect(isBefore('2026-02-09', '2026-02-10')).toBe(true);
      });
    });

    describe('isEqualOrAfter', () => {
      test('returns true when date is after comparison date', () => {
        expect(isEqualOrAfter(later, middle)).toBe(true);
      });

      test('returns true when dates are equal', () => {
        expect(isEqualOrAfter(middle, middle)).toBe(true);
      });

      test('returns false when date is before comparison date', () => {
        expect(isEqualOrAfter(earlier, middle)).toBe(false);
      });

      test('works with string dates', () => {
        expect(isEqualOrAfter('2026-02-10', '2026-02-10')).toBe(true);
      });
    });

    describe('isBetween', () => {
      test('returns true when date is strictly between start and end', () => {
        expect(isBetween(middle, earlier, later)).toBe(true);
      });

      test('returns false when date equals start date', () => {
        expect(isBetween(earlier, earlier, later)).toBe(false);
      });

      test('returns false when date equals end date', () => {
        expect(isBetween(later, earlier, later)).toBe(false);
      });

      test('returns false when date is before start date', () => {
        expect(isBetween(earlier, middle, later)).toBe(false);
      });

      test('returns false when date is after end date', () => {
        expect(isBetween(later, earlier, middle)).toBe(false);
      });

      test('works with string dates', () => {
        expect(isBetween('2026-02-10', '2026-02-09', '2026-02-11')).toBe(true);
      });
    });
  });
});
