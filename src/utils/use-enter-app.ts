import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';
import {PartialRoute, Route, useNavigation} from '@react-navigation/native';
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
