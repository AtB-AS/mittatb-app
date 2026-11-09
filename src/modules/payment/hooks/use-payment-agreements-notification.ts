import {useEffect, useState} from 'react';
import {
  isPaymentAgreementSupported,
  PaymentAgreement,
} from '@atb/modules/ticketing';
import {usePaymentAgreementDiscovery} from './use-payment-agreement-discovery';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

/**
 * Whether to show the notification on the payment agreements. The agreements
 * are discovered once shown, but the notification is kept for the rest of the
 * visit so the user sees what it pointed to, until they have an agreement.
 */
export const usePaymentAgreementsNotification = (
  paymentAgreements: PaymentAgreement[] | undefined,
) => {
  const {
    shouldShowPaymentAgreementDiscovery,
    completePaymentAgreementDiscovery,
  } = usePaymentAgreementDiscovery();
  const [isDiscoveredThisVisit, setIsDiscoveredThisVisit] = useState(false);
  const isFocused = useIsFocusedAndActive();
  useEffect(() => {
    if (!isFocused || !shouldShowPaymentAgreementDiscovery) return;
    setIsDiscoveredThisVisit(true);
    completePaymentAgreementDiscovery();
  }, [
    isFocused,
    shouldShowPaymentAgreementDiscovery,
    completePaymentAgreementDiscovery,
  ]);

  const hasSupportedPaymentAgreement = paymentAgreements?.some(
    (paymentAgreement) =>
      isPaymentAgreementSupported(paymentAgreement.paymentType),
  );
  useEffect(() => {
    if (hasSupportedPaymentAgreement) setIsDiscoveredThisVisit(false);
  }, [hasSupportedPaymentAgreement]);

  return isDiscoveredThisVisit && !hasSupportedPaymentAgreement;
};
