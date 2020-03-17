import {formatDistanceStrict, Locale, parseISO, format} from 'date-fns';

export function secondsToDuration(seconds: number, locale?: Locale): string {
  return formatDistanceStrict(Date.now() + seconds * 1000, Date.now(), {
    locale,
    onlyNumeric: true,
  });
}

export function formatToClock(isoDate: string) {
  return format(parseISO(isoDate), 'HH:mm');
}
