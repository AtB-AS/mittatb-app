import {useAppState} from '@atb/AppContext';
import {useEnterApp} from './use-enter-app';

/**
 * Hook to complete the onboarding process and navigate to the next screen.
 * This hook provides a function to navigate directly to the next specific screen,
 * with Root_TabNavigatorStack as the only screen you can go back to.
 * It omits other animations or transitions in between.
 *
 * @returns {Function} A function that, when called, checks if the onboarding is not completed,
 * completes it, and then navigates to the next screen in the onboarding flow or the Root_TabNavigatorStack.
 */
export const useCompleteOnboardingAndEnterApp = () => {
  const {onboarded, completeOnboarding} = useAppState();
  const enterApp = useEnterApp();

  return () => {
    !onboarded && completeOnboarding();
    enterApp();
  };
};
