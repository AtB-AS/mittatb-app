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

export function secondsToDurationShort(seconds: number): string {
  return shortHumanizer(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
  });
}

export function secondsToMinutesShort(seconds: number): string {
  return shortHumanizer(seconds * 1000, {
    units: ['m'],
    round: true,
  });
}

export function secondsToDuration(
  seconds: number,
  language: string = 'no',
): string {
  return humanizeDuration(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
    language,
  });
}

export function secondsBetween(
  start: string | Date,
  end: string | Date,
): number {
  const parsedStart = start instanceof Date ? start : parseISO(start);
  const parsedEnd = end instanceof Date ? end : parseISO(end);
  return differenceInSeconds(parsedEnd, parsedStart);
}

export function formatToClock(isoDate: string | Date) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  return format(parsed, 'HH:mm');
}

/**
 * Either show clock or relative time (X minute) if below threshold specified by second argument.
 *
 * @param isoDate date to format as clock or relative time
 * @param minuteLimit threshold in minutes for when to show relative time
 */
export function formatToClockOrRelativeMinutes(
  isoDate: string | Date,
  minuteThreshold: number = 9,
) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  if (diff <= 0 || diff / 60 >= minuteThreshold) {
    return format(parsed, 'HH:mm');
  }

  if (diff / 60 <= 1) {
    return 'Nå';
  }

  return secondsToMinutesShort(diff);
}

export function formatToLongDateTime(isoDate: string | Date, locale?: Locale) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed);
  }
  return format(parsed, 'PPp', {locale});
}
