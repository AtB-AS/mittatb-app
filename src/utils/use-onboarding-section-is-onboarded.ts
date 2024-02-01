import {OnboardingSectionId} from './use-onboarding-sections';
import {useAppState} from '@atb/AppContext';

export const useOnboardingSectionIsOnboarded: (
  onboardingSectionId: OnboardingSectionId,
) => boolean = (onboardingSectionId) => {
  const {loadedOnboardingSections} = useAppState();
  return (
    loadedOnboardingSections.find(
      (lOS) => lOS.onboardingSectionId === onboardingSectionId,
    )?.isOnboarded ?? false
  );
};
