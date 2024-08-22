// import {Language} from '@atb/translations';
// import {formatLocaleTime} from '../date';

import {Language} from '@atb/translations';
import {parseISO} from 'date-fns';
import {formatLocaleTime, formatToLongDateTime} from '../date';
import timeMocker from 'timezone-mock';

type TimeZone =
  | 'US/Pacific'
  | 'US/Eastern'
  | 'Brazil/East'
  | 'UTC'
  | 'Europe/London'
  | 'Australia/Adelaide';

describe.only.each<TimeZone>([
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
    test('for norwegian (bokmål) format', () => {
      expect(
        formatToLongDateTime('2024-09-01T12:00:00Z', Language.Norwegian),
      ).toBe('01. sep. 14:00');
    });

    test('for english format', () => {
      expect(
        formatToLongDateTime('2024-09-01T12:00:00Z', Language.English),
      ).toBe('01. Sep 14:00');
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
