import {useEffect} from 'react';
import {Linking} from 'react-native';
import {PaymentType} from '@atb/ticketing';

/**
 * Open Vipps after successful reservation if the payment type is Vipps.
 */
export const useOpenVippsAfterReservation = (
  url: string | undefined,
  paymentType: PaymentType,
  onErrorCallback: () => void,
) => {
  useEffect(() => {
    if (paymentType === PaymentType.Vipps && url) {
      Linking.openURL(url).catch(onErrorCallback);
    }
  }, [paymentType, url, onErrorCallback]);
};
