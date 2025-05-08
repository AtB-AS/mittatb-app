import {useOnboardingContext} from '@atb/modules/onboarding';

export const useIsLoadingAppState = () => {
  const {isLoading: onboardingIsLoading} = useOnboardingContext();
  return onboardingIsLoading; // also wait for e.g. popover flags ++?
};
