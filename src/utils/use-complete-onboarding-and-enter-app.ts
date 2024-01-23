import {useAppState} from '@atb/AppContext';

import {useOnboardingFlow} from '@atb/utils/use-onboarding-flow';
import {PartialRoute, Route, useNavigation} from '@react-navigation/native';
import {RootNavigationProps, RootStackParamList} from '@atb/stacks-hierarchy';

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

export type AfterLoginScreenType =
  | NextScreenParams<'Root_TabNavigatorStack'>
  | NextScreenParams<'Root_PurchaseOverviewScreen'>
  | NextScreenParams<'Root_PurchaseConfirmationScreen'>
  | NextScreenParams<'Root_ActiveTokenOnPhoneRequiredForFareProductScreen'>;

export type NextScreenParams<T extends keyof RootStackParamList> = {
  screen: T;
  /*
     Can use 'as any' when using these params when navigating, as type safety is
     ensured at creation time.
     */
  params: RootStackParamList[T];
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
  const {getNextOnboardingScreen} = useOnboardingFlow();
  const navigation = useNavigation<RootNavigationProps>();

  return () => {
    const nextOnboardingScreen = getNextOnboardingScreen(undefined, true);

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [{name: 'Root_TabNavigatorStack'}];

    if (nextOnboardingScreen?.screenName) {
      routes.push({
        name: nextOnboardingScreen.screenName,
        params: nextOnboardingScreen.params,
      });
    }

    navigation.reset({routes});
  };
};
