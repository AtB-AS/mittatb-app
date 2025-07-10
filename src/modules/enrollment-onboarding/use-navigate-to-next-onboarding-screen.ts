import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {EnrollmentOnboardingNavigationProps} from './navigation-types';
import {enrollmentOnboardingConfig} from './enrollment-onboarding-config';
import {EnrollmentOnboardingScreenName} from './types';

export function useNavigateToNextEnrollmentOnboardingScreen(
  configId: string,
  currentScreenName: string,
) {
  const navigation = useNavigation<EnrollmentOnboardingNavigationProps>();

  return useCallback(() => {
    const nextScreenName = getNextOnboardingScreenName(
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

export function getNextOnboardingScreenName(
  configId: string,
  currentScreenName: string,
): EnrollmentOnboardingScreenName | undefined {
  const config = enrollmentOnboardingConfig.find((c) => c.id === configId);
  if (!config) return undefined;

  const currentIndex = config.onboardingScreens.findIndex(
    (s) => s.name === currentScreenName,
  );
  if (currentIndex === -1) return undefined;

  return config.onboardingScreens[currentIndex + 1]?.name;
}
