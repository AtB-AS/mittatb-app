import {
  formatDistanceToNowStrict,
  Locale,
  parseISO,
  format,
  differenceInSeconds,
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
  return formatDistanceToNowStrict(Date.now() + seconds * 1000, {
    locale,
    onlyNumeric: true,
  });
}

export function secondsBetween(start: string, end: string): number {
  return differenceInSeconds(parseISO(end), parseISO(start));
}

export function formatToClock(isoDate: string) {
  return format(parseISO(isoDate), 'HH:mm');
}
