import {useOnboardingContext} from '@atb/modules/onboarding';

export const useIsLoadingAppState = () => {
  const {isLoading: onboardingIsLoading} = useOnboardingContext();
  return onboardingIsLoading;
};
