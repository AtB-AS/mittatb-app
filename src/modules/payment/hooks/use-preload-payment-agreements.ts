import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {
  isPaymentAgreementSupported,
  usePaymentAgreementsQuery,
} from '@atb/modules/ticketing';

/**
 * Preloads the payment agreements, so the payment doesn't have to wait for
 * them on the confirmation screen.
 */
export const usePreloadPaymentAgreements = ({isFree}: {isFree: boolean}) => {
  const {isVippsPaymentAgreementEnabled} = useFeatureTogglesContext();
  const {paymentTypes} = useFirestoreConfigurationContext();
  usePaymentAgreementsQuery(
    isVippsPaymentAgreementEnabled &&
      !isFree &&
      paymentTypes.some(isPaymentAgreementSupported),
  );
};
