import {useOnboardingState} from '@atb/onboarding';
import {
  OnboardingSectionId,
  OnboardingSection,
  LoadedOnboardingSection,
} from './types';

export const useOnboardingSectionIsOnboarded: (
  onboardingSectionId: OnboardingSectionId,
) => boolean = (onboardingSectionId) => {
  const {onboardingSections} = useOnboardingState();
  return getOnboardingSectionIsOnboarded(
    onboardingSections,
    onboardingSectionId,
  );
};

export const getOnboardingSectionIsOnboarded: (
  onboardingSections: (LoadedOnboardingSection | OnboardingSection)[],
  onboardingSectionId: OnboardingSectionId,
) => boolean = (onboardingSections, onboardingSectionId) =>
  onboardingSections.find(
    (oS) => oS.onboardingSectionId === onboardingSectionId,
  )?.isOnboarded ?? false;
