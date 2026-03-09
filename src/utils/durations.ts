export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const HALF_DAY_MS = 12 * ONE_HOUR_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;
export const ONE_WEEK_MS = 7 * ONE_DAY_MS;

/**
 * Parses an duration string on the format `PT{hours}H{minutes}M{seconds}S`,
 * such as `PT8H6M12.345S` into a number of seconds.
 */
export function parseDuration(duration: string): number | undefined {
  // Matches ISO-8601 duration strings in the form PTnHnMnS with optional sign
  // and optional fractional seconds, e.g. PT8H6M12.345S, -PT15M, PT20S.
  const regex = /^([+-])?P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)$/;
  const match = duration.match(regex);

  if (!match) return undefined;

  const sign = match[1] === '-' ? -1 : 1;
  const hoursPart = match[3];
  const minutesPart = match[4];
  const secondsPart = match[5];

  // At least one of hours, minutes or seconds must be present.
  if (!hoursPart && !minutesPart && !secondsPart) {
    return undefined;
  }

  const hours = hoursPart ? Number.parseInt(hoursPart, 10) : 0;
  const minutes = minutesPart ? Number.parseInt(minutesPart, 10) : 0;
  const seconds = secondsPart ? Number.parseFloat(secondsPart) : 0;

  const totalSeconds = sign * (hours * 3600 + minutes * 60 + seconds);

  return Number.isFinite(totalSeconds) ? totalSeconds : undefined;
}
