import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {OnboardingCarouselNavigationProps} from './navigation-types';
import {onboardingCarouselConfigs} from './onboarding-carousel-config';
import {OnboardingCarouselScreenName} from './types';

export function useNavigateToNextOnboardingCarouselScreen(
  configId: string,
  currentScreenName: string,
) {
  const navigation = useNavigation<OnboardingCarouselNavigationProps>();

  return useCallback(() => {
    const nextScreenName = getNextOnboardingCarouselScreenName(
      configId,
      currentScreenName,
    );
    if (nextScreenName) {
      navigation.navigate(nextScreenName);
    } else {
      navigation.getParent()?.goBack();
    }
  }, [configId, currentScreenName, navigation]);
}

export function getNextOnboardingCarouselScreenName(
  configId: string,
  currentScreenName: string,
): OnboardingCarouselScreenName | undefined {
  const config = onboardingCarouselConfigs.find((c) => c.id === configId);
  if (!config) return undefined;

  const currentIndex = config.onboardingScreens.findIndex(
    (s) => s.name === currentScreenName,
  );
  if (currentIndex === -1) return undefined;

  return config.onboardingScreens[currentIndex + 1]?.name;
}
