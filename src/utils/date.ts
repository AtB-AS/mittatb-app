import {
  Locale,
  parseISO,
  format,
  differenceInSeconds,
  isSameDay,
  isPast,
  differenceInCalendarDays,
} from 'date-fns';
import nb from 'date-fns/locale/nb';

import humanizeDuration from 'humanize-duration';
import {Language, DEFAULT_LANGUAGE} from './language';

function getShortHumanizer(ms: number, options?: humanizeDuration.Options) {
  const opts = {
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

    ...options,
  };
  return shortHumanizer(ms, opts);
}
const shortHumanizer = humanizeDuration.humanizer({});

export const missingRealtimePrefix = 'ca. ';

export function secondsToDurationShort(seconds: number): string {
  return getShortHumanizer(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
  });
}

export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

export function secondsToDuration(
  seconds: number,
  opts?: humanizeDuration.Options,
  language?: Language,
): string {
  const currentLanguage = language === Language.Norwegian ? 'no' : 'en';
  return humanizeDuration(seconds * 1000, {
    units: ['d', 'h', 'm'],
    round: true,
    language: currentLanguage,
    ...opts,
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
  return formatLocaleTime(parsed);
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
  language?: Language,
) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  if (isInThePast(parsed) || diff / 60 >= minuteThreshold) {
    return formatLocaleTime(parsed, language);
  }

  if (diff / 60 <= 1) {
    return 'Nå';
  }

  return secondsToMinutes(diff);
}
export function formatLocaleTime(date: Date, language?: Language) {
  const lang = language ?? DEFAULT_LANGUAGE;
  switch (lang) {
    case Language.Norwegian:
      return format(date, 'HH:mm');
    case Language.English:
      return format(date, 'h:mm a');
  }
}
export function isInThePast(isoDate: string | Date) {
  return isPast(isoDate instanceof Date ? isoDate : parseISO(isoDate));
}

export function formatToLongDateTime(isoDate: string | Date, locale?: Locale) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed);
  }
  return format(parsed, 'PPp', {locale});
}

export {isSameDay};

export function formatToSimpleDate(date: Date, locale: Locale = nb) {
  return format(date, 'do MMMM', {locale});
}

export function daysBetween(base: Date, target: Date) {
  return differenceInCalendarDays(target, base);
}

export function isSeveralDays(items: string[]) {
  if (!items.length) return false;
  let first = parseISO(items[0]);
  for (let item of items) {
    if (!isSameDay(first, parseISO(item))) {
      return false;
    }
  }
  return true;
}
