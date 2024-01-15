import {useAppState} from '@atb/AppContext';
import {useEnterApp} from './use-enter-app';

/**
 * Hook to complete the onboarding process and correctly navigate to the next screen.
 *
 * @returns {Function} A function that, when called, checks if the onboarding is not completed,
 * completes it if not, and then navigates to the next screen using enterApp.
 */
export const useCompleteOnboardingAndEnterApp = () => {
  const {onboarded, completeOnboarding} = useAppState();
  const enterApp = useEnterApp();

  return () => {
    !onboarded && completeOnboarding();
    enterApp();
  };
};
