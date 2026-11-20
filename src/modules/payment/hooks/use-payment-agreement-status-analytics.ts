import {useEffect, useRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  PaymentAgreement,
  usePaymentAgreementsQuery,
} from '@atb/modules/ticketing';
import {secondsBetween} from '@atb/utils/date';
import {getPendingPaymentAgreementOutcomes} from '../get-pending-payment-agreement-outcomes';
import {usePaymentAgreementAnalyticsProperties} from './use-payment-agreement-analytics-properties';

/**
 * Logs when a payment agreement seen as pending becomes active, or is gone
 * without becoming active.
 *
 * Only agreements seen as pending in this app session are tracked, so nothing
 * has to be stored. The agreements are not fetched for this, it only follows
 * the agreements fetched elsewhere in the app.
 */
export const usePaymentAgreementStatusAnalytics = () => {
  const {logEvent} = useAnalyticsContext();
  const paymentAgreementAnalyticsProperties =
    usePaymentAgreementAnalyticsProperties();
  const {data: paymentAgreements} = usePaymentAgreementsQuery(false);
  const pendingPaymentAgreementsRef = useRef<PaymentAgreement[]>([]);

  useEffect(() => {
    // E.g. after logging out, so another user's agreements aren't compared
    if (!paymentAgreements) {
      pendingPaymentAgreementsRef.current = [];
      return;
    }

    const {activated, notActivated} = getPendingPaymentAgreementOutcomes(
      pendingPaymentAgreementsRef.current,
      paymentAgreements,
    );
    pendingPaymentAgreementsRef.current = paymentAgreements.pending;

    activated.forEach((paymentAgreement) =>
      logEvent('Payment agreement', 'Pending activated', {
        paymentType: paymentAgreement.paymentType,
        // From the agreement's own timestamps, so it's right even if the app
        // sees it as active a while after it was activated
        secondsToActive: paymentAgreement.updatedAt
          ? secondsBetween(
              paymentAgreement.createdAt,
              paymentAgreement.updatedAt,
            )
          : undefined,
        ...paymentAgreementAnalyticsProperties,
      }),
    );
    notActivated.forEach((paymentAgreement) =>
      logEvent('Payment agreement', 'Pending not activated', {
        paymentType: paymentAgreement.paymentType,
        ...paymentAgreementAnalyticsProperties,
      }),
    );
  }, [paymentAgreements, logEvent, paymentAgreementAnalyticsProperties]);
};
