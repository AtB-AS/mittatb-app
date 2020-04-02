import {
  formatDistanceStrict,
  Locale,
  parseISO,
  format,
  differenceInSeconds,
} from 'date-fns';

export function secondsToDuration(seconds: number, locale?: Locale): string {
  return formatDistanceStrict(Date.now() + seconds * 1000, Date.now(), {
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
