import {useEffect} from 'react';
import {PaymentType} from '@atb/modules/ticketing';
import {openUrl} from '@atb/utils/open-url';

/**
 * Open Vipps after successful reservation if the payment type is Vipps.
 */
export const useOpenVippsAfterReservation = (
  url: string | undefined,
  paymentType: PaymentType | undefined,
  onErrorCallback: () => void,
) => {
  useEffect(() => {
    if (paymentType === PaymentType.Vipps && url) {
      openUrl(url, 'Could not open Vipps for payment', onErrorCallback);
    }
  }, [paymentType, url, onErrorCallback]);
};
