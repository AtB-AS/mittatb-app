import {useOnboardingContext, useOnboardingFlow} from '@atb/onboarding';

import {PartialRoute, Route, useNavigation} from '@react-navigation/native';
import {RootNavigationProps, RootStackParamList} from '@atb/stacks-hierarchy';

/**
 * Hook to complete the onboarding process and correctly navigate to the next screen.
 *
 * @returns {Function} A function that, when called, checks if the onboarding is not completed,
 * completes it if not, and then navigates to the next screen using enterApp.
 */
export const useCompleteUserCreationOnboardingAndEnterApp = () => {
  const {completeOnboardingSection} = useOnboardingContext();

  const enterApp = useEnterApp();

  return () => {
    completeOnboardingSection('userCreation');
    enterApp();
  };
};

/**
 * This hook provides a function to navigate directly to the next screen,
 * with Root_TabNavigatorStack as the only screen you can go back to.
 * It omits unwanted animations or transitions in between.
 *
 * @returns {Function} A function that when called, navigates to either the
 * 'Root_TabNavigatorStack', or the next onboarding screen based on the app's
 * current state.
 */
const useEnterApp = () => {
  const {getNextOnboardingSection} = useOnboardingFlow();
  const navigation = useNavigation<RootNavigationProps>();

  return () => {
    const nextOnboardingSection = getNextOnboardingSection(undefined, true);

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [{name: 'Root_TabNavigatorStack'}];

    const {name, params} = nextOnboardingSection?.initialScreen || {};
    name && routes.push({name, params});

    navigation.reset({routes});
  };
};
