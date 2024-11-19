import {Language, TranslateFunction, dictionary} from '@atb/translations';
import {
  FormatOptions,
  Locale,
  RoundingMethod,
  addHours,
  addMinutes as fnsAddMinutes,
  differenceInCalendarDays,
  differenceInMinutes,
  differenceInSeconds,
  format as fnsFormat,
  isAfter as fnsIsAfter,
  isBefore as fnsIsBefore,
  getHours,
  getMinutes,
  getSeconds,
  isPast,
  isSameDay as isSameDayInternal,
  isSameYear,
  isToday,
  isWithinInterval,
  parse,
  parseISO,
  roundToNearestMinutes,
  set,
  isValid,
} from 'date-fns';
import {
  FormatOptionsWithTZ,
  formatInTimeZone,
  fromZonedTime,
  toZonedTime,
} from 'date-fns-tz';
import {enGB as en, nb} from 'date-fns/locale';
import humanizeDuration from 'humanize-duration';

export {daysInWeek} from 'date-fns/constants';

import {
  parse as parseIso8601Duration,
  toSeconds as toSecondsIso8601Duration,
} from 'iso8601-duration';

const CET = 'Europe/Oslo';
/**
 * Wrapped default formatting to take CET timezone into account
 * should be used instead of normal format function from date-fns
 *
 * @param date Date to format
 * @param formatStr Format string
 * @param options options with if time zone should not be considered
 * @returns formatted date
 */
function format(
  date: string | number | Date,
  formatStr: string,
  options?: FormatOptions & {ignoreTimeZone?: boolean},
) {
  if (options?.ignoreTimeZone) {
    return fnsFormat(date, formatStr, options);
  } else {
    return formatInTimeZone(date, CET, formatStr, {
      ...options,
      timeZone: CET,
    } as FormatOptionsWithTZ);
  }
}

const humanizer = humanizeDuration.humanizer({});

function parseIfNeeded(a: string | Date): Date {
  return a instanceof Date ? a : parseISO(a);
}

export function iso8601DurationToSeconds(iso8601Duration: string) {
  return toSecondsIso8601Duration(parseIso8601Duration(iso8601Duration));
}

export function secondsToDurationShort(
  seconds: number,
  language: Language,
): string {
  return getShortHumanizer(seconds * 1000, language, {
    units: ['d', 'h', 'm'],
    round: true,
    conjunction: ' ',
  });
}
// Translates seconds to minutes without postfix. Returns minimum 1
export function secondsToMinutes(seconds: number): string {
  return Math.max(Math.round(seconds / 60), 1).toString();
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

export function secondsToMinutesLong(
  seconds: number,
  language: Language,
): string {
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
  const currentLanguage = language === Language.English ? 'en' : 'no';
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

/**
 * Return minutes between start and end. If end is before start the returned
 * value will be negative.
 */
export function minutesBetween(
  start: string | Date,
  end: string | Date,
): number {
  const parsedStart = parseIfNeeded(start);
  const parsedEnd = parseIfNeeded(end);
  return differenceInMinutes(parsedEnd, parsedStart);
}

export function formatToClock(
  isoDate: string | Date,
  language: Language,
  roundingMethod: RoundingMethod,
  showSeconds?: boolean,
) {
  const parsed = parseIfNeeded(isoDate);
  const rounded = !showSeconds
    ? roundToNearestMinutes(parsed, {roundingMethod})
    : parsed;
  const seconds = showSeconds ? ':' + format(parsed, 'ss') : '';

  return formatLocaleTime(rounded, language) + seconds;
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
  nowText: string,
  minuteThreshold: number = 9,
) {
  const parsed = parseIfNeeded(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  if (diff / 60 >= minuteThreshold) {
    return formatLocaleTime(parsed, language);
  }

  if (diff / 60 <= 1) {
    return nowText;
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

  return secondsToMinutesLong(diff, language);
}

export function isRelativeButNotNow(
  isoDate: string | Date,
  minuteThreshold: number = 9,
) {
  const parsed = parseIfNeeded(isoDate);
  const diff = secondsBetween(new Date(), parsed);

  return !(diff / 60 >= minuteThreshold || diff / 60 <= 1);
}

type LocalTimeFormatOptions = {
  ignoreTimeZone: boolean;
};

/**
 * Formats date or string to HH:mm format, with optional time zone consideration
 *
 * @param date Date to format
 * @param _language @deprecated No longer in use
 * @param options if time zone should not be considered
 * @returns
 */
export function formatLocaleTime(
  date: Date | string,
  _language: Language,
  options?: LocalTimeFormatOptions,
) {
  return format(parseIfNeeded(date), 'HH:mm', options);
}

export function isInThePast(isoDate: string | Date) {
  return isPast(parseIfNeeded(isoDate));
}

export const isBetween = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date,
) => isAfter(date, startDate) && isBefore(date, endDate);

export const isAfter = (date: string | Date, dateToCompare: string | Date) =>
  fnsIsAfter(parseIfNeeded(date), parseIfNeeded(dateToCompare));

export const isBefore = (date: string | Date, dateToCompare: string | Date) =>
  fnsIsBefore(parseIfNeeded(date), parseIfNeeded(dateToCompare));

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
    return formatToClock(parsed, language, 'floor');
  }
  if (isSameYear(parsed, new Date())) {
    return formatToShortDateTimeWithoutYear(parsed, language);
  }
  return fullDateTime(parsed, language);
}

export function formatToShortDateTimeWithoutYear(
  isoDate: string | Date,
  language: Language,
) {
  const parsed = parseIfNeeded(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed, language, 'floor');
  }
  return format(parsed, 'dd. MMM HH:mm', {
    locale: languageToLocale(language),
  });
}

function formatToShortDateTimeWithoutYearWithAtTime(
  isoDate: string | Date,
  t: TranslateFunction,
  language: Language,
) {
  const parsed = parseIfNeeded(isoDate);
  const hourTime =
    t(dictionary.date.atTime) + ' ' + formatToClock(parsed, language, 'floor');
  if (isSameDay(parsed, new Date())) {
    return hourTime;
  } else {
    return (
      format(parsed, 'dd. MMM', {
        locale: languageToLocale(language),
      }) +
      ' ' +
      hourTime
    );
  }
}

export function formatToShortDateTimeWithRelativeDayNames(
  fromDate: string | Date,
  toDate: string | Date,
  t: TranslateFunction,
  language: Language,
) {
  const daysDifference = daysBetween(fromDate, toDate);

  let formattedTime = formatToShortDateTimeWithoutYearWithAtTime(
    toDate,
    t,
    language,
  );
  if (Math.abs(daysDifference) < 3) {
    formattedTime =
      t(dictionary.date.relativeDayNames(daysDifference)) + ' ' + formattedTime;
  }
  return formattedTime;
}

export function fullDateTime(isoDate: string | Date, language: Language) {
  const parsed = parseIfNeeded(isoDate);
  return format(parsed, 'PP, p', {
    locale: languageToLocale(language),
  });
}

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
  const at =
    language === Language.English
      ? 'at'
      : Language.Nynorsk
      ? 'klokka'
      : 'klokken';

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

export function parseISOFromCET(isoDate: string) {
  return toZonedTime(parseISO(isoDate), CET);
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
  return differenceInCalendarDays(
    toZonedTime(parseIfNeeded(target), CET),
    toZonedTime(parseIfNeeded(base), CET),
  );
}
export function isSameDay(base: string | Date, target: string | Date) {
  return isSameDayInternal(
    toZonedTime(parseIfNeeded(target), CET),
    toZonedTime(parseIfNeeded(base), CET),
  );
}

export function isSeveralDays(items: string[]) {
  if (!items.length) return false;
  const first = parseISO(items[0]);
  for (const item of items) {
    if (!isSameDay(first, parseISO(item))) {
      return false;
    }
  }
  return true;
}

export function dateWithReplacedTime(
  date: Date | string,
  time: string,
  options: {
    formatString?: string;
    ignoreTimeZone?: boolean;
  } = {},
) {
  const parsedDate = parseIfNeeded(date);
  if (!options.ignoreTimeZone) {
    const [hours, minutes] = time.split(':').map(Number);

    // Convert the parsed date to CET
    const cetDate = toZonedTime(parsedDate, CET);

    // Set the time in CET
    const updatedCETDate = set(cetDate, {
      hours,
      minutes,
      seconds: 0,
    });

    // Convert back to UTC
    return fromZonedTime(updatedCETDate, CET);
  }

  const parsedTime = parse(time, options.formatString || 'HH:mm', new Date());

  return set(parsedDate, {
    hours: getHours(parsedTime),
    minutes: getMinutes(parsedTime),
    seconds: getSeconds(parsedTime),
  });
}

export function differenceInMinutesStrings(
  dateLeft: string | Date,
  dateRight: string | Date,
) {
  return differenceInMinutes(parseIfNeeded(dateLeft), parseIfNeeded(dateRight));
}

export const addMinutes = (date: string | Date, minutes: number): Date =>
  fnsAddMinutes(parseIfNeeded(date), minutes);

const languageToLocale = (language: Language): Locale => {
  switch (language) {
    case Language.Norwegian:
      return nb;
    case Language.English:
      return en;
    case Language.Nynorsk:
      return nb;
  }
};

function getShortHumanizer(
  ms: number,
  language: Language,
  options?: humanizeDuration.Options,
) {
  const opts = {
    language: language === Language.English ? 'shortEn' : 'shortNo',
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
    language: language === Language.English ? 'en' : 'no',
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

export const isValidDateString = (dateString: string) => {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate);
};
