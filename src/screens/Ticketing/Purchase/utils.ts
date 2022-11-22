import {useGeolocationState} from '@atb/GeolocationContext';
import {
  PreassignedFareProductType,
  TariffZone,
} from '@atb/reference-data/types';
import {PaymentType} from '@atb/ticketing/types';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {format, parseISO} from 'date-fns';
import {useMemo} from 'react';

export type PurchaseFlow = {
  /**
   * Whether the traveller selection should allow a single traveller or
   * multiple travellers to be selected.
   */
  travellerSelectionMode: 'single' | 'multiple';

  /**
   * Whether the customer should be able to select a future start time for the
   * ticket.
   */
  travelDateSelectionEnabled: boolean;

  /**
   * Whether the customer should be able to select between a set of durations
   * for the ticket, based on `fareproduct.durationDays`.
   */
  durationSelectionEnabled: boolean;
};

export const getPurchaseFlow = (
  productType: PreassignedFareProductType,
): PurchaseFlow => {
  switch (productType) {
    case 'period':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: true,
        durationSelectionEnabled: true,
      };
    case 'hour24':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: true,
        durationSelectionEnabled: false,
      };
    case 'single':
      return {
        travellerSelectionMode: 'multiple',
        travelDateSelectionEnabled: false,
        durationSelectionEnabled: false,
      };
    case 'night':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: false,
        durationSelectionEnabled: false,
      };
    case 'carnet':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: false,
        durationSelectionEnabled: false,
      };
  }
};

export function getExpireDate(iso: string): string {
  let date = parseISO(iso);
  return format(date, 'MM/yy');
}

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

export const useTariffZoneFromLocation = (tariffZones: TariffZone[]) => {
  const {location} = useGeolocationState();
  return useMemo(() => {
    if (location) {
      const {longitude, latitude} = location.coordinates;
      return tariffZones.find((t) =>
        turfBooleanPointInPolygon([longitude, latitude], t.geometry),
      );
    }
  }, [tariffZones, location]);
};
