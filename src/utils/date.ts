import {
  differenceInCalendarDays,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isPast,
  isSameDay,
  Locale,
  parseISO,
} from 'date-fns';
import en from 'date-fns/locale/en-GB';
import nb from 'date-fns/locale/nb';
import humanizeDuration from 'humanize-duration';
import {DEFAULT_LANGUAGE, Language} from '../translations';

const shortHumanizer = humanizeDuration.humanizer({});

function parseIfNeeded(a: string | Date): Date {
  return a instanceof Date ? a : parseISO(a);
}

export function secondsToDurationShort(
  seconds: number,
  language: Language,
): string {
  return getShortHumanizer(seconds * 1000, language, {
    units: ['d', 'h', 'm'],
    round: true,
  });
}

export function secondsToMinutesShort(
  seconds: number,
  language: Language,
): string {
  return getShortHumanizer(seconds * 1000, language, {
    units: ['m'],
    round: true,
  });
}

export function secondsToDuration(
  seconds: number,
  language: Language,
  opts?: humanizeDuration.Options,
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
  const parsedStart = parseIfNeeded(start);
  const parsedEnd = parseIfNeeded(end);
  return differenceInSeconds(parsedEnd, parsedStart);
}

export function formatToClock(isoDate: string | Date, language: Language) {
  const parsed = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  return formatLocaleTime(parsed, language);
}

/**
 * Either show clock or relative time (X minute) if below threshold specified by second argument.
 *
 * @param isoDate date to format as clock or relative time
 * @param minuteLimit threshold in minutes for when to show relative time
 */
export function formatToClockOrRelativeMinutes(
  isoDate: string | Date,
  language: Language,
  now: string,
  minuteThreshold: number = 9,
) {
  const parsed = parseIfNeeded(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  if (diff / 60 >= minuteThreshold) {
    return formatLocaleTime(parsed, language);
  }

  if (diff / 60 <= 1) {
    return now;
  }

  return secondsToMinutesShort(diff, language);
}
export function isRelativeButNotNow(
  isoDate: string | Date,
  minuteThreshold: number = 9,
) {
  const parsed = parseIfNeeded(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  if (diff / 60 >= minuteThreshold || diff / 60 <= 1) {
    return false;
  }

  return true;
}

export function formatLocaleTime(date: Date, language: Language) {
  const lang = language ?? DEFAULT_LANGUAGE;
  switch (lang) {
    case Language.Norwegian:
      return format(date, 'HH:mm');
    case Language.English:
      return format(date, 'h:mm a');
  }
}
export function isInThePast(isoDate: string | Date) {
  return isPast(parseIfNeeded(isoDate));
}
export function isNumberOfMinutesInThePast(
  isoDate: string | Date,
  minutes: number,
) {
  return differenceInMinutesStrings(isoDate, new Date()) < -minutes;
}

export function formatToLongDateTime(
  isoDate: string | Date,
  language: Language,
) {
  const parsed = parseIfNeeded(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed, language);
  }
  return format(parsed, 'PPp', {locale: languageToLocale(language)});
}

export {isSameDay};

export function formatToSimpleDate(date: Date, language: Language) {
  return format(date, 'do MMMM', {locale: languageToLocale(language)});
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

export function differenceInMinutesStrings(
  dateLeft: string | Date,
  dateRight: string | Date,
) {
  return differenceInMinutes(parseIfNeeded(dateLeft), parseIfNeeded(dateRight));
}

const languageToLocale = (language: Language): Locale => {
  switch (language) {
    case Language.Norwegian:
      return nb;
    case Language.English:
      return en;
  }
};

function getShortHumanizer(
  ms: number,
  language: Language,
  options?: humanizeDuration.Options,
) {
  const opts = {
    language: language === Language.Norwegian ? 'shortNo' : 'shortEn',
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
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'm',
        s: () => 's',
        ms: () => 'ms',
      },
    },

    ...options,
  };

  return shortHumanizer(ms, opts);
}
