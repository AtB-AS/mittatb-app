import {useOnboardingState} from '@atb/onboarding';
import {OnboardingSectionId} from './use-onboarding-sections';

export const useOnboardingSectionIsOnboarded: (
  onboardingSectionId: OnboardingSectionId,
) => boolean = (onboardingSectionId) => {
  const {loadedOnboardingSections} = useOnboardingState();
  return (
    loadedOnboardingSections.find(
      (lOS) => lOS.onboardingSectionId === onboardingSectionId,
    )?.isOnboarded ?? false
  );
};
