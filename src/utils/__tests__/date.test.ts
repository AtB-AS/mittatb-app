// import {Language} from '@atb/translations';
// import {formatLocaleTime} from '../date';

import {Language} from '@atb/translations';
import timeMocker from 'timezone-mock';
import {
  dateWithReplacedTime,
  formatLocaleTime,
  formatToLongDateTime,
} from '../date';

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
