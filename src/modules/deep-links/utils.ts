import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Coordinates} from '@atb/utils/coordinates';

/**
 * Parses unknown param data as an integer, or falls back to undefined.
 */
export const parseParamAsInt = (data: any): number | undefined => {
  if (typeof data === 'string') return parseInt(data) || undefined;
  if (typeof data === 'number') return Math.round(data);
  return undefined;
};

/**
 * Parses a pair of deeplink params as latitude and longitude, or falls back to
 * undefined.
 */
export const parseParamsAsCoordinates = (
  lat: string | undefined,
  lon: string | undefined,
): Coordinates | undefined => {
  if (!lat?.trim() || !lon?.trim()) return undefined;
  const [latitude, longitude] = [lat, lon].map(Number);
  if (!isFinite(latitude) || !isFinite(longitude)) return undefined;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return undefined;
  return {latitude, longitude};
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
