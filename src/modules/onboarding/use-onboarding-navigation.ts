import {RootNavigationProps} from '@atb/stacks-hierarchy';

import {useNavigation, StackActions} from '@react-navigation/native';

import {useCallback} from 'react';
import {InteractionManager} from 'react-native';
import {
  useOnboardingFlow,
  useOnboardingContext,
  OnboardingSectionId,
} from '@atb/modules/onboarding';

export const useOnboardingNavigation = () => {
  const navigation = useNavigation<RootNavigationProps>();
  const {getNextOnboardingSection} = useOnboardingFlow();
  const {completeOnboardingSection} = useOnboardingContext();

  const goToScreen = useCallback(
    (replace: any, screen: {name?: any; params?: any}) => {
      InteractionManager.runAfterInteractions(() => {
        if (!screen?.name) return;
        if (replace) {
          navigation.dispatch(StackActions.replace(screen.name, screen.params));
        } else {
          navigation.navigate(screen.name, screen.params);
        }
      });
    },
    [navigation],
  );

  const continueFromOnboardingSection = useCallback(
    (comingFromOnboardingSectionId: OnboardingSectionId) => {
      completeOnboardingSection(comingFromOnboardingSectionId);
      const nextOnboardingSection = getNextOnboardingSection(
        comingFromOnboardingSectionId,
      );

      if (nextOnboardingSection?.initialScreen?.name) {
        goToScreen(true, nextOnboardingSection?.initialScreen);
      } else {
        navigation.getParent()?.goBack() ?? navigation.goBack(); // get parent in case of stack. If problematic, accept param to determine which.
      }
    },
    [
      completeOnboardingSection,
      getNextOnboardingSection,
      goToScreen,
      navigation,
    ],
  );

  return {
    goToScreen,
    continueFromOnboardingSection,
  };
};
