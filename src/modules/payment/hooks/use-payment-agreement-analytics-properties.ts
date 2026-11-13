import {useMemo} from 'react';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

/**
 * Analytics properties to add to payment agreement events, so they can be
 * told apart, and kept when the rest of the events are downsampled:
 *
 * - `paymentAgreementOnboarding`: which onboarding to payment agreements the
 *   user gets, if any.
 */
export const usePaymentAgreementAnalyticsProperties = (): {
  paymentAgreementOnboarding: 'dots' | 'checkbox' | undefined;
} => {
  const {
    isVippsPaymentAgreementEnabled,
    isPaymentAgreementOnboardingDotsEnabled,
    isPaymentAgreementOnboardingCheckboxEnabled,
  } = useFeatureTogglesContext();

  const paymentAgreementOnboarding = !isVippsPaymentAgreementEnabled
    ? undefined
    : // The onboardings should not overlap, so the checkbox wins if both are
      // enabled, like in usePaymentAgreementDiscovery
      isPaymentAgreementOnboardingCheckboxEnabled
      ? 'checkbox'
      : isPaymentAgreementOnboardingDotsEnabled
        ? 'dots'
        : undefined;

  return useMemo(
    () => ({paymentAgreementOnboarding}),
    [paymentAgreementOnboarding],
  );
};
