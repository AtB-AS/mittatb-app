import {useOnboardingState} from '@atb/onboarding';

export const useIsLoadingAppState = () => {
  const {isLoading: onboardingIsLoading} = useOnboardingState();
  return onboardingIsLoading; // also wait for e.g. popover flags ++?
};
