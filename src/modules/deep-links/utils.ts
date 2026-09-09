import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

/**
 * Parses unknown param data as an integer, or falls back to undefined.
 */
export const parseParamAsInt = (data: any): number | undefined => {
  if (typeof data === 'string') return parseInt(data) || undefined;
  if (typeof data === 'number') return Math.round(data);
  return undefined;
};

/**
 * Parses a comma separated deeplink param as form factors, keeping only the
 * values which are valid form factors.
 *
 * NOTE: We avoid parsing against FormFactorSchema here, since it would make
 * the tests import unsupported libraries.
 */
export const parseParamAsFormFactors = (
  data: string | undefined,
): FormFactor[] => {
  const formFactors: string[] = Object.values(FormFactor);
  return (
    data
      ?.split(',')
      .map((value) => value.trim().toUpperCase())
      .filter((value): value is FormFactor => formFactors.includes(value)) ?? []
  );
};
