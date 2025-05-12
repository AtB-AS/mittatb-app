import {format, parseISO} from 'date-fns';
import {ErrorType} from '@atb/api/utils';
import {LocationSearchTexts, TranslateFunction} from '@atb/translations';
import {FareZone} from '@atb/modules/configuration';
import {
  FareZoneWithMetadata,
  useFareZoneFromLocation,
} from '@atb/fare-zones-selector';
import {useMemo} from 'react';

//Will be used for saved payment method notifications/card expiration messages after backend implementation
export function getExpireDate(iso: string): string {
  const date = parseISO(iso);
  // Subtract one day to get the correct expiry date
  // This must be done since the expiry date stored is the date the card expires,
  // and the date that shows on the card is the month before the card expires
  // Example: The card expires the moment the date is 02.2021, but the date on the card is 01.2021
  date.setDate(date.getDate() - 1);
  return format(date, 'dd.MM.yy');
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
 * Get the default fare zone, either based on current location, default fare
 * zone set on fare zone in reference data or else the first fare zone in the
 * provided fare zones list.
 */
export const useDefaultFareZone = (
  fareZones: FareZone[],
): FareZoneWithMetadata => {
  const fareZoneFromLocation = useFareZoneFromLocation(fareZones);
  return useMemo<FareZoneWithMetadata>(() => {
    if (fareZoneFromLocation) {
      return {...fareZoneFromLocation, resultType: 'geolocation'};
    }

    const defaultFareZone = fareZones.find(
      (fareZone) => fareZone.isDefault,
    );

    if (defaultFareZone) {
      return {...defaultFareZone, resultType: 'zone'};
    }

    return {...fareZones[0], resultType: 'zone'};
  }, [fareZones, fareZoneFromLocation]);
};

/**
 * Checks for whitelisting of fare zones, if there is no whitelisting,
 * return the original fare zones. If there is a whitelist, return the
 * filtered zones.
 */
export const useFilterFareZone = (
  fareZones: FareZone[],
  allowedFareZoneRefs: string[],
): FareZone[] => {
  return useMemo<FareZone[]>(() => {
    if (allowedFareZoneRefs.length === 0) {
      return fareZones;
    }

    return fareZones.filter((fareZone) =>
      allowedFareZoneRefs.some(
        (allowedZone) => fareZone.id === allowedZone,
      ),
    );
  }, [fareZones, allowedFareZoneRefs]);
};

/**
 * Parses unknown param data as an integer, or falls back to undefined.
 */
export const parseParamAsInt = (data: any): number | undefined => {
  if (typeof data === 'string') return parseInt(data) || undefined;
  if (typeof data === 'number') return Math.round(data);
  return undefined;
};
