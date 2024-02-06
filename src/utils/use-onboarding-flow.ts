import {RootStackParamList} from '@atb/stacks-hierarchy';

import {useCallback, useEffect, useState} from 'react';

import {PartialRoute, Route} from '@react-navigation/native';
import {
  OnboardingSectionId,
  OnboardingSection,
  useOnboardingSections,
} from './use-onboarding-sections';

// note: utilizeThisHookInstanceForSessionCounting should only be true for one instance
export const useOnboardingFlow = (
  utilizeThisHookInstanceForSessionCounting = false,
  assumeUserCreationOnboarded = false,
) => {
  const onboardingSections = useOnboardingSections(
    utilizeThisHookInstanceForSessionCounting,
  );

  const getNextOnboardingSection = useCallback(
    (
      comingFromOnboardingSectionId?: OnboardingSectionId,
      assumeUserCreationOnboarded?: Boolean,
    ): OnboardingSection | undefined =>
      onboardingSections.find((onboardingSection) => {
        const hasSeenOnboardingSection = onboardingSection?.isOnboarded;

        const customShouldShowOnboardingSection =
          onboardingSection.customShouldShow ||
          onboardingSection.customShouldShow === undefined;

        const skipDueToUserCreatedAssumption =
          onboardingSection?.shouldShowBeforeUserCreated &&
          assumeUserCreationOnboarded;

        const isComingFromThisOnboardingSection =
          onboardingSection.onboardingSectionId ===
          comingFromOnboardingSectionId;

        const isNextOnboardingSection =
          !hasSeenOnboardingSection &&
          customShouldShowOnboardingSection &&
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
   * @returns navigation state object
   */
  const getInitialNavigationContainerState = () => {
    const defaultInitialRouteName = 'Root_TabNavigatorStack';
    const nextOnboardingSection = getNextOnboardingSection(); // dont rely on effects as it will be too late for initialState
    const initialOnboardingScreen = nextOnboardingSection?.initialScreen;
    const initialOnboardingRoute = {
      name: initialOnboardingScreen?.name ?? defaultInitialRouteName,
      params: initialOnboardingScreen?.params,
    };

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [initialOnboardingRoute];
    if (
      !nextOnboardingSection?.shouldShowBeforeUserCreated &&
      initialOnboardingScreen?.name
    ) {
      routes.unshift({name: defaultInitialRouteName});
    }
    return {routes};
  };

  return {
    nextOnboardingSection,
    getNextOnboardingSection,
    getInitialNavigationContainerState,
  };
};
