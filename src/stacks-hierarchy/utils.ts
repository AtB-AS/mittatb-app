import {useEffect, useMemo, useRef} from 'react';
import {TariffZone} from '@atb/reference-data/types';
import {useGeolocationState} from '@atb/GeolocationContext';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {PaymentType} from '@atb/ticketing';
import {format, parseISO} from 'date-fns';

export function useDoOnceWhen(fn: () => void, condition: boolean) {
  const firstTimeRef = useRef(true);
  useEffect(() => {
    if (firstTimeRef.current && condition) {
      firstTimeRef.current = false;
      fn();
    }
    return () => {
      firstTimeRef.current = true;
    };
  }, [condition]);
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
  let date = parseISO(iso);
  return format(date, 'MM/yy');
}
