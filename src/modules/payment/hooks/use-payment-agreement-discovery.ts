import {useCallback, useEffect} from 'react';
import {useAuthContext} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {
  useOnboardingContext,
  useOnboardingSectionIsOnboarded,
} from '@atb/modules/onboarding';
import {
  isPaymentAgreementSupported,
  usePaymentAgreementsQuery,
} from '@atb/modules/ticketing';

const ONBOARDING_SECTION_ID = 'paymentAgreementDiscovery';

/**
 * Guides the user to payment agreements with notification dots on the way to
 * the agreements section, until they have seen it once on this device.
 */
export const usePaymentAgreementDiscovery = () => {
  const {
    isPaymentAgreementOnboardingDotsEnabled,
    isPaymentAgreementOnboardingCheckboxEnabled,
    isVippsPaymentAgreementEnabled,
  } = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const {paymentTypes} = useFirestoreConfigurationContext();
  const {completeOnboardingSection} = useOnboardingContext();
  // Loaded before the app renders, together with the other onboarding sections
  const hasSeen = useOnboardingSectionIsOnboarded(ONBOARDING_SECTION_ID);
  const completePaymentAgreementDiscovery = useCallback(
    () => completeOnboardingSection(ONBOARDING_SECTION_ID),
    [completeOnboardingSection],
  );

  const isEnabled =
    isVippsPaymentAgreementEnabled &&
    isPaymentAgreementOnboardingDotsEnabled &&
    // The pilots should not overlap, so the checkbox wins if both are enabled
    !isPaymentAgreementOnboardingCheckboxEnabled &&
    authenticationType === 'phone' &&
    paymentTypes.some(isPaymentAgreementSupported);

  const paymentAgreements = usePaymentAgreementsQuery(isEnabled && !hasSeen)
    .data?.active;
  const hasSupportedPaymentAgreement = paymentAgreements?.some(
    (paymentAgreement) =>
      isPaymentAgreementSupported(paymentAgreement.paymentType),
  );

  const shouldShowPaymentAgreementDiscovery =
    isEnabled &&
    !hasSeen &&
    paymentAgreements !== undefined &&
    !hasSupportedPaymentAgreement;

  // Having a payment agreement means it's already discovered, so don't show the
  // dots again if the payment agreement is stopped later.
  useEffect(() => {
    if (!hasSeen && hasSupportedPaymentAgreement)
      completePaymentAgreementDiscovery();
  }, [
    hasSeen,
    hasSupportedPaymentAgreement,
    completePaymentAgreementDiscovery,
  ]);

  return {
    shouldShowPaymentAgreementDiscovery,
    completePaymentAgreementDiscovery,
  };
};
