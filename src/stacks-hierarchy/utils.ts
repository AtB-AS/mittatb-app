import {format, parseISO} from 'date-fns';
import {ErrorType} from '@atb/api/utils';
import {LocationSearchTexts, TranslateFunction} from '@atb/translations';
import {TariffZone} from '@atb/configuration';
import {
  TariffZoneWithMetadata,
  useTariffZoneFromLocation,
} from '@atb/tariff-zones-selector';
import {useMemo} from 'react';

export function getExpireDate(iso: string): string {
  const date = parseISO(iso);
  // Subtract one day to get the correct expiry date
  // This must be done since the expiry date stored is the date the card expires,
  // and the date that shows on the card is the month before the card expires
  // Example: The card expires the moment the date is 02.2021, but the date on the card is 01.2021
  date.setDate(date.getDate() - 1);
  return format(date, 'MM/yy');
}

export function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(LocationSearchTexts.messages.networkError);
    default:
      return t(LocationSearchTexts.messages.defaultError);
  }
}
/**
 * Get the default tariff zone, either based on current location, default tariff
 * zone set on tariff zone in reference data or else the first tariff zone in the
 * provided tariff zones list.
 */
export const useDefaultTariffZone = (
  tariffZones: TariffZone[],
): TariffZoneWithMetadata => {
  const tariffZoneFromLocation = useTariffZoneFromLocation(tariffZones);
  return useMemo<TariffZoneWithMetadata>(() => {
    if (tariffZoneFromLocation) {
      return {...tariffZoneFromLocation, resultType: 'geolocation'};
    }

    const defaultTariffZone = tariffZones.find(
      (tariffZone) => tariffZone.isDefault,
    );

    if (defaultTariffZone) {
      return {...defaultTariffZone, resultType: 'zone'};
    }

    return {...tariffZones[0], resultType: 'zone'};
  }, [tariffZones, tariffZoneFromLocation]);
};

/**
 * Checks for whitelisting of tariff zones, if there is no whitelisting,
 * return the original tariff zones. If there is a whitelist, return the
 * filtered zones.
 */
export const useFilterTariffZone = (
  tariffZones: TariffZone[],
  allowedTariffZoneRefs: string[],
): TariffZone[] => {
  return useMemo<TariffZone[]>(() => {
    if (allowedTariffZoneRefs.length === 0) {
      return tariffZones;
    }

    return tariffZones.filter((tariffZone) =>
      allowedTariffZoneRefs.some(
        (allowedZone) => tariffZone.id === allowedZone,
      ),
    );
  }, [tariffZones, allowedTariffZoneRefs]);
};

/**
 * Parses unknown param data as an integer, or falls back to undefined.
 */
export const parseParamAsInt = (data: any): number | undefined => {
  if (typeof data === 'string') return parseInt(data) || undefined;
  if (typeof data === 'number') return Math.round(data);
  return undefined;
};
