import {useEffect, useState} from 'react';
import {PaymentType, ReserveOffer, reserveOffers} from '@atb/tickets';

export default function useTerminalState(
  offers: ReserveOffer[],
  paymentType: PaymentType.Visa | PaymentType.Mastercard,
  recurringPaymentId: number | undefined,
  saveRecurringCard: boolean,
) {
  const [terminalUrl, setTerminalUrl] = useState<string>();

  useEffect(() => {
    (async function () {
      const response = recurringPaymentId
        ? await reserveOffers({
            offers,
            paymentType: paymentType,
            recurringPaymentId: recurringPaymentId,
            opts: {
              retry: true,
            },
            scaExemption: true,
          })
        : await reserveOffers({
            offers,
            paymentType: paymentType,
            savePaymentMethod: saveRecurringCard,
            opts: {
              retry: true,
            },
            scaExemption: true,
          });
      setTerminalUrl(response.url);
    })();
  }, []);

  return terminalUrl;
}
