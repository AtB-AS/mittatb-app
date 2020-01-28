import {formatDistanceStrict, Locale} from 'date-fns';

export function secondsToDuration(seconds: number, locale?: Locale): string {
  return formatDistanceStrict(Date.now() + seconds * 1000, Date.now(), {
    locale,
  });
}
