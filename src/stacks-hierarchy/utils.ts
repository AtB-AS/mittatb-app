import {PaymentType} from '@atb/ticketing';
import {format, parseISO} from 'date-fns';
import {ErrorType} from '@atb/api/utils';
import {LocationSearchTexts, TranslateFunction} from '@atb/translations';
import {TariffZone} from '@atb/configuration';
import {
  TariffZoneWithMetadata,
  useTariffZoneFromLocation,
} from '@atb/tariff-zones-selector';
import {useMemo} from 'react';

export function getPaymentTypeName(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    default:
      return '';
  }
}

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

export const useFilterTariffZone = (
  tariffZones: TariffZone[],
  allowedTariffZones: string[],
): TariffZone[] => {

  return useMemo<TariffZone[]>(() => {
    if (allowedTariffZones.length === 0) {
      return tariffZones;
    } 
  
    return tariffZones.filter((tariffZone) => allowedTariffZones.some((allowedZone) => tariffZone.id === allowedZone));
  }, [tariffZones, allowedTariffZones]);
}
