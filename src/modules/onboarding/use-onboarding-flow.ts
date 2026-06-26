import {RootStackParamList} from '@atb/stacks-hierarchy';

import {useCallback, useEffect, useState} from 'react';

import {PartialRoute, Route} from '@react-navigation/native';

import {
  useOnboardingContext,
  OnboardingSection,
  OnboardingSectionId,
} from '@atb/modules/onboarding';

export const useOnboardingFlow = (assumeUserCreationOnboarded = false) => {
  const {onboardingSections} = useOnboardingContext();

  const getNextOnboardingSection = useCallback(
    (
      comingFromOnboardingSectionId?: OnboardingSectionId,
      assumeUserCreationOnboarded?: Boolean,
    ): OnboardingSection | undefined =>
      onboardingSections.find((onboardingSection) => {
        const hasSeenOnboardingSection = onboardingSection?.isOnboarded;

        const skipDueToUserCreatedAssumption =
          onboardingSection?.shouldShowBeforeUserCreated &&
          assumeUserCreationOnboarded;

        const isComingFromThisOnboardingSection =
          onboardingSection.onboardingSectionId ===
          comingFromOnboardingSectionId;

        const isNextOnboardingSection =
          !hasSeenOnboardingSection &&
          onboardingSection.shouldShow &&
          !skipDueToUserCreatedAssumption &&
          !isComingFromThisOnboardingSection;

        return isNextOnboardingSection;
      }),
    [onboardingSections],
  );

  const [nextOnboardingSection, setNextOnboardingSection] = useState<
    OnboardingSection | undefined
  >(getNextOnboardingSection(undefined, assumeUserCreationOnboarded));

  useEffect(() => {
    setNextOnboardingSection(
      getNextOnboardingSection(undefined, assumeUserCreationOnboarded),
    );
  }, [getNextOnboardingSection, assumeUserCreationOnboarded]);

  /**
   * add defaultInitialRouteName as root when userCreationOnboarded
   * this allows goBack from an onboarding screen when used as initial screen
   * @returns navigation state object, or undefined when there is no onboarding
   * to show so that deep links can take effect on cold start
   */
  const getInitialNavigationContainerState = useCallback(() => {
    const defaultInitialRouteName = 'Root_TabNavigatorStack';
    const nextOnboardingSection = getNextOnboardingSection(); // dont rely on effects as it will be too late for initialState
    const initialOnboardingScreen = nextOnboardingSection?.initialScreen;
    if (!initialOnboardingScreen?.name) return undefined;
    const initialOnboardingRoute = {
      name: initialOnboardingScreen.name,
      params: initialOnboardingScreen.params,
    };

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [initialOnboardingRoute];
    if (!nextOnboardingSection?.shouldShowBeforeUserCreated) {
      routes.unshift({name: defaultInitialRouteName});
    }
    return {routes};
  }, [getNextOnboardingSection]);

  return {
    nextOnboardingSection,
    getNextOnboardingSection,
    getInitialNavigationContainerState,
  };
};
