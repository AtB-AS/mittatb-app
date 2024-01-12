import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';
import {PartialRoute, Route, useNavigation} from '@react-navigation/native';
import {useAppState} from '@atb/AppContext';
import {RootNavigationProps, RootStackParamList} from '@atb/stacks-hierarchy';

export type NextScreenParams<T extends keyof RootStackParamList> = {
  screen: T;
  /*
   Can use 'as any' when using these params when navigating, as type safety is
   ensured at creation time.
   */
  params: RootStackParamList[T];
};
export type AfterLoginScreenType =
  | NextScreenParams<'Root_TabNavigatorStack'>
  | NextScreenParams<'Root_PurchaseOverviewScreen'>
  | NextScreenParams<'Root_PurchaseConfirmationScreen'>
  | NextScreenParams<'Root_ActiveTokenOnPhoneRequiredForFareProductScreen'>;

// Returns a function that allows going directly to the next specific screen with Root_TabNavigatorStack as the only screen you can go back to, without other animations/transistions in between

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

export const useEnterApp = () => {
  const {getNextOnboardingScreen} = useOnboardingNavigationFlow();
  const navigation = useNavigation<RootNavigationProps>();

  return (afterLogin?: AfterLoginScreenType) => {
    const nextOnboardingScreen = getNextOnboardingScreen(undefined, true);

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [{name: 'Root_TabNavigatorStack'}];

    if (afterLogin) {
      routes.push({
        name: afterLogin.screen,
        params: afterLogin.params,
      });
    } else if (nextOnboardingScreen?.screenName) {
      routes.push({
        name: nextOnboardingScreen.screenName,
        params: nextOnboardingScreen.params,
      });
    }

    navigation.reset({routes});
  };
};