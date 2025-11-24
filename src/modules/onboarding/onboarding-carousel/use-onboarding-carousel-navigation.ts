import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {OnboardingCarouselNavigationProps} from './navigation-types';
import {onboardingCarouselConfigs} from './onboarding-carousel-config';
import {
  OnboardingCarouselConfigId,
  OnboardingCarouselScreenName,
} from './types';
import {useOnboardingNavigation} from '../use-onboarding-navigation';
import {useOnboardingContext} from '../OnboardingContext';

function getAdjacentOnboardingCarouselScreenName(
  configId: OnboardingCarouselConfigId,
  currentScreenName: string,
  offset: number,
): OnboardingCarouselScreenName | undefined {
  const config = onboardingCarouselConfigs.find((c) => c.id === configId);
  if (!config) return undefined;

  const currentIndex = config.onboardingScreens.findIndex(
    (s) => s.name === currentScreenName,
  );

  const index = currentIndex + offset;

  if (index < 0 || index >= config.onboardingScreens.length) {
    return undefined;
  }

  return config.onboardingScreens[index]?.name;
}

function useNavigateToAdjacentOnboardingCarouselScreen(
  configId: OnboardingCarouselConfigId,
  currentScreenName: string,
  offset: number,
) {
  const navigation = useNavigation<OnboardingCarouselNavigationProps>();
  const {continueFromOnboardingSection} = useOnboardingNavigation();
  const {onboardingSections} = useOnboardingContext();

  return useCallback(() => {
    const adjacentScreenName = getAdjacentOnboardingCarouselScreenName(
      configId,
      currentScreenName,
      offset,
    );
    if (adjacentScreenName) {
      navigation.navigate(adjacentScreenName);
    } else {
      const comingFromOnboardingSectionId = onboardingSections.find(
        (onboardingSection) =>
          onboardingSection.initialScreen?.params?.configId === configId,
      )?.onboardingSectionId;

      if (comingFromOnboardingSectionId) {
        continueFromOnboardingSection(comingFromOnboardingSectionId);
      } else {
        // should never happen
        console.error('UNKNOWN ONBOARDING SECTION');
        navigation.getParent()?.goBack();
      }
    }
  }, [
    configId,
    currentScreenName,
    offset,
    navigation,
    onboardingSections,
    continueFromOnboardingSection,
  ]);
}

export function useOnboardingCarouselNavigation(
  configId: OnboardingCarouselConfigId,
  currentScreenName: string,
) {
  const navigateToNextScreen = useNavigateToAdjacentOnboardingCarouselScreen(
    configId,
    currentScreenName,
    1,
  );
  const navigateToPreviousScreen =
    useNavigateToAdjacentOnboardingCarouselScreen(
      configId,
      currentScreenName,
      -1,
    );

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const closeOnboardingCarousel = continueFromOnboardingSection;

  return {
    navigateToNextScreen,
    navigateToPreviousScreen,
    closeOnboardingCarousel,
  };
}
