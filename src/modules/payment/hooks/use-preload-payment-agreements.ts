import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {
  isPaymentAgreementSupported,
  usePaymentAgreementsQuery,
} from '@atb/modules/ticketing';

/**
 * Preloads the payment agreements, so the payment doesn't have to wait for
 * them on the confirmation screen. Only when payment agreements are available,
 * and `enabled`, e.g. not when the trip is free.
 */
export const usePreloadPaymentAgreements = (enabled: boolean) => {
  const {isVippsPaymentAgreementEnabled} = useFeatureTogglesContext();
  const {paymentTypes} = useFirestoreConfigurationContext();
  usePaymentAgreementsQuery(
    enabled &&
      isVippsPaymentAgreementEnabled &&
      paymentTypes.some(isPaymentAgreementSupported),
  );
};
