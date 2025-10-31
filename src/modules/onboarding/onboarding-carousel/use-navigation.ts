import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {OnboardingCarouselNavigationProps} from './navigation-types';
import {onboardingCarouselConfigs} from './onboarding-carousel-config';
import {OnboardingCarouselScreenName} from './types';

function getAdjacentOnboardingCarouselScreenName(
  configId: string,
  currentScreenName: string,
  offset: number,
): OnboardingCarouselScreenName | undefined {
  const config = onboardingCarouselConfigs.find((c) => c.id === configId);
  if (!config) return undefined;

  const currentIndex = config.onboardingScreens.findIndex(
    (s) => s.name === currentScreenName,
  );
  if (currentIndex === -1) return undefined;

  return config.onboardingScreens[currentIndex + offset]?.name;
}

function useNavigateToAdjacentOnboardingCarouselScreen(
  configId: string,
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
  configId: string,
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

  const navigation = useNavigation<OnboardingCarouselNavigationProps>();
  const closeOnboardingCarousel = () => {
    navigation.getParent()?.goBack();
  };

  return {
    navigateToNextScreen,
    navigateToPreviousScreen,
    closeOnboardingCarousel,
  };
}
