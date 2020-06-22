import {
  Locale,
  parseISO,
  format,
  differenceInSeconds,
  isSameDay,
} from 'date-fns';

import humanizeDuration from 'humanize-duration';
const shortHumanizer = humanizeDuration.humanizer({
  language: 'shortNo',
  languages: {
    shortNo: {
      y: () => 'år',
      mo: () => 'm',
      w: () => 'u',
      d: () => 'd',
      h: () => 't',
      m: () => 'min',
      s: () => 'sek',
      ms: () => 'ms',
    },
  },
});

export function secondsToDurationExact(seconds: number): string {
  return shortHumanizer(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
  });
}

export function secondsToDuration(seconds: number, locale?: Locale): string {
  return humanizeDuration(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
    language: 'no',
  });
}

export function secondsBetween(start: string, end: string): number {
  return differenceInSeconds(parseISO(end), parseISO(start));
}

export function formatToClock(isoDate: string | Date) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  return format(parsed, 'HH:mm');
}

export function formatToLongDateTime(isoDate: string | Date, locale?: Locale) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed);
  }
  return format(parsed, 'PPp', {locale});
}
