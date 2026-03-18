import {iso4217_currencies} from './iso4217_currencies';

const getCurrencyData = (currency?: string) =>
  iso4217_currencies?.[currency?.toUpperCase() ?? 'NOK'];

/**
 * Returns the symbol for a given ISO 4217 currency code.
 *
 * @param currency Three-letter currency code (for example `NOK`, `USD`, `EUR`). Defaults to `NOK` when omitted.
 * @returns The matching symbol from `iso4217.ts`, or `kr` when no match is found.
 */
export const getCurrencySymbol = (currency?: string): string =>
  getCurrencyData(currency).symbol ?? 'kr';

/**
 * Returns the major currency unit name based on amount.
 *
 * @param amount Amount used to choose singular (1) or plural (all other values).
 * @param currency Three-letter currency code (for example NOK, GBP, SEK). Defaults to NOK when omitted.
 * @returns The singular or plural major unit name, or Kroner when no match is found.
 */
export const getCurrencyMajorName = (
  amount: number,
  currency?: string,
): string =>
  getCurrencyData(currency)[amount === 1 ? 'majorSingle' : 'majorPlural'] ??
  'Kroner';
