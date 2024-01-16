import {RootNavigationProps, RootStackParamList} from '@atb/stacks-hierarchy';

import {useNavigation, StackActions} from '@react-navigation/native';

import {useCallback} from 'react';
import {InteractionManager} from 'react-native';
import {useOnboardingFlow} from './use-onboarding-navigation-flow';

export const useOnboardingNavigation = () => {
  const navigation = useNavigation<RootNavigationProps>();
  const {getNextOnboardingScreen} = useOnboardingFlow();

  const goToScreen = useCallback(
    (replace, screenName, params?) => {
      InteractionManager.runAfterInteractions(() => {
        if (replace) {
          navigation.dispatch(StackActions.replace(screenName, params));
        } else {
          navigation.navigate(screenName, params);
        }
      });
    },
    [navigation],
  );

  const continueFromOnboardingScreen = useCallback(
    (comingFromScreenName?: keyof RootStackParamList) => {
      const nextOnboardingScreen =
        getNextOnboardingScreen(comingFromScreenName);
      if (nextOnboardingScreen?.screenName) {
        goToScreen(
          true,
          nextOnboardingScreen.screenName,
          nextOnboardingScreen.params,
        );
      } else {
        navigation.goBack();
      }
    },
    [getNextOnboardingScreen, goToScreen, navigation],
  );

  return {
    goToScreen,
    continueFromOnboardingScreen,
  };
};
