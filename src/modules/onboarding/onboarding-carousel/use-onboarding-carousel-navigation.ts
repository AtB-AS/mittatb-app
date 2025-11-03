import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {OnboardingCarouselNavigationProps} from './navigation-types';
import {onboardingCarouselConfigs} from './onboarding-carousel-config';
import {
  OnboardingCarouselConfigId,
  OnboardingCarouselScreenName,
} from './types';
import {useOnboardingNavigation} from '../use-onboarding-navigation';

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

  if (currentIndex < 0 || currentIndex >= config.onboardingScreens.length)
    return undefined;

  return config.onboardingScreens[currentIndex + offset]?.name;
}

function useNavigateToAdjacentOnboardingCarouselScreen(
  configId: OnboardingCarouselConfigId,
  currentScreenName: string,
  offset: number,
) {
  const navigation = useNavigation<OnboardingCarouselNavigationProps>();

  return useCallback(() => {
    const adjacentScreenName = getAdjacentOnboardingCarouselScreenName(
      configId,
      currentScreenName,
      offset,
    );
    if (adjacentScreenName) {
      navigation.navigate(adjacentScreenName);
    } else {
      navigation.getParent()?.goBack();
    }
  }, [configId, currentScreenName, offset, navigation]);
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
