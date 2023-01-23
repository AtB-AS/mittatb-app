import {useGeolocationState} from '@atb/GeolocationContext';
import {TariffZone} from '@atb/reference-data/types';
import {PaymentType} from '@atb/ticketing/types';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {format, parseISO} from 'date-fns';
import {useMemo} from 'react';

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
