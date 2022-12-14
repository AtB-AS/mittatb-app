import {
  addHours,
  differenceInCalendarDays,
  differenceInMinutes,
  differenceInSeconds,
  format,
  getHours,
  getMinutes,
  isPast,
  isSameDay,
  isToday,
  isWithinInterval,
  Locale,
  parse,
  parseISO,
  set,
} from 'date-fns';
import en from 'date-fns/locale/en-GB';
import nb from 'date-fns/locale/nb';
import humanizeDuration from 'humanize-duration';
import {DEFAULT_LANGUAGE, Language} from '../translations';

const humanizer = humanizeDuration.humanizer({});

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

export function secondsToMinutes(seconds: number, language: Language): string {
  return getHumanizer(seconds * 1000, language, {
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

/**
 * Return seconds between start and end. If end is before start the returned
 * value will be negative.
 */
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
 * Either show clock or relative time (X min) if below threshold specified by
 * second argument.
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

/**
 * Either show clock or long relative time (X minutes) if below threshold
 * specified by second argument.
 *
 * @param isoDate date to format as clock or relative time
 * @param minuteLimit threshold in minutes for when to show relative time
 */
export function formatToClockOrLongRelativeMinutes(
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

  return secondsToMinutes(diff, language);
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

export function formatLocaleTime(date: Date | string, language: Language) {
  const lang = language ?? DEFAULT_LANGUAGE;
  switch (lang) {
    case Language.Norwegian:
      return format(parseIfNeeded(date), 'HH:mm');
    case Language.English:
      return format(parseIfNeeded(date), 'HH:mm');
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

export function formatToShortDateTimeWithoutYear(
  isoDate: string | Date,
  language: Language,
) {
  const parsed = parseIfNeeded(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed, language);
  }
  return format(parsed, 'dd. MMM HH:mm', {locale: languageToLocale(language)});
}

export function fullDateTime(isoDate: string | Date, language: Language) {
  const parsed = parseIfNeeded(isoDate);
  return format(parsed, 'PPp', {locale: languageToLocale(language)});
}

export {isSameDay};

export function formatToShortDate(date: Date | string, language: Language) {
  return format(parseIfNeeded(date), 'dd. MMM', {
    locale: languageToLocale(language),
  });
}

export function formatToShortDateWithYear(
  date: Date | string,
  language: Language,
) {
  return format(parseIfNeeded(date), 'dd.MM.yy', {
    locale: languageToLocale(language),
  });
}

export function formatToSimpleDate(date: Date | string, language: Language) {
  return format(parseIfNeeded(date), 'do MMMM', {
    locale: languageToLocale(language),
  });
}

export function formatToVerboseFullDate(
  date: Date | string,
  language: Language,
) {
  return format(parseIfNeeded(date), 'do MMMM yyyy', {
    locale: languageToLocale(language),
  });
}

export function formatToVerboseDateTime(
  date: Date | string,
  language: Language,
) {
  const at = language === Language.Norwegian ? 'klokken' : 'at';

  const dateString = format(parseIfNeeded(date), 'do MMMM', {
    locale: languageToLocale(language),
  });
  const timeString = format(parseIfNeeded(date), 'HH:mm', {
    locale: languageToLocale(language),
  });

  return isToday(parseIfNeeded(date))
    ? `${timeString}`
    : `${dateString} ${at} ${timeString}`;
}

export const isWithin24Hours = (
  dateLeft: Date | string,
  dateRight: Date | string,
) => {
  const leftParsed = parseIfNeeded(dateLeft);
  const rightParsed = parseIfNeeded(dateRight);
  return isWithinInterval(rightParsed, {
    start: leftParsed,
    end: addHours(leftParsed, 24),
  });
};

export const isWithinSameDate = (
  dateLeft: Date | string,
  dateRight: Date | string,
) => {
  const leftParsed = parseIfNeeded(dateLeft);
  const rightParsed = parseIfNeeded(dateRight);
  return isSameDay(leftParsed, rightParsed);
};

export function formatToShortSimpleDate(
  date: Date | string,
  language: Language,
) {
  return format(parseIfNeeded(date), 'do MMM', {
    locale: languageToLocale(language),
  });
}

export function formatToWeekday(
  date: Date | string,
  language: Language,
  dateFormat?: string,
) {
  return format(parseIfNeeded(date), dateFormat ? dateFormat : 'EEEEEE', {
    locale: languageToLocale(language),
  });
}

export function daysBetween(base: string | Date, target: string | Date) {
  return differenceInCalendarDays(parseIfNeeded(target), parseIfNeeded(base));
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

export function dateWithReplacedTime(date: Date | string, time: string) {
  const parsedTime = parse(time, 'HH:mm', new Date());
  return set(parseIfNeeded(date), {
    hours: getHours(parsedTime),
    minutes: getMinutes(parsedTime),
  });
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
        m: () => 'min',
        s: () => 's',
        ms: () => 'ms',
      },
    },

    ...options,
  };

  return humanizer(ms, opts);
}

function getHumanizer(
  ms: number,
  language: Language,
  options?: humanizeDuration.Options,
) {
  const opts = {
    language: language === Language.Norwegian ? 'no' : 'en',
    languages: {
      no: {
        y: () => 'år',
        mo: () => 'måneder',
        w: () => 'uker',
        d: () => 'dager',
        h: () => 'timer',
        m: () => 'minutter',
        s: () => 'sekunder',
        ms: () => 'millisekunder',
      },
      en: {
        y: () => 'years',
        mo: () => 'months',
        w: () => 'weeks',
        d: () => 'days',
        h: () => 'hours',
        m: () => 'minutes',
        s: () => 'seconds',
        ms: () => 'milliseconds',
      },
    },

    ...options,
  };

  return humanizer(ms, opts);
}
